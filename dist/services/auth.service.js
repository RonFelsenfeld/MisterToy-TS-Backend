"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_service_1 = require("./logger.service");
const user_service_1 = require("./user.service");
exports.authService = {
    login,
    signup,
    logout,
    getUserFromToken,
    applyTokenCookie,
};
const JTW_SECRET_KEY = process.env.JWT_SECRET_KEY;
const cryptoSecretKey = process.env.CRYPTO_SECRET_KEY;
async function login(username, encryptedPassword) {
    logger_service_1.logger.debug(`Logging-in with username: ${username}`);
    try {
        const user = await user_service_1.userService.getByUsername(username);
        if (!user)
            return Promise.reject(`User not found with username: ${username}`);
        const decryptedPassword = _decryptPassword(encryptedPassword);
        const isMatch = await _isPasswordsMatch(decryptedPassword, user.password);
        if (!isMatch)
            return Promise.reject('Passwords do not match');
        // The passwords matches
        const token = _generateToken(user);
        const securedUser = user_service_1.userService.createSecuredUser(user);
        return { token, user: securedUser };
    }
    catch (err) {
        throw err;
    }
}
async function signup(credentials) {
    logger_service_1.logger.debug(`Signing-up with username: ${credentials.username}`);
    try {
        const { isValid, error } = await _validateCredentials(credentials);
        if (!isValid)
            throw new Error(error);
        const { password } = credentials;
        const decryptedPassword = _decryptPassword(password);
        const hashedPassword = await _hashPassword(decryptedPassword);
        const newUser = await user_service_1.userService.add({ ...credentials, password: hashedPassword });
        return newUser;
    }
    catch (err) {
        throw err;
    }
}
async function logout(res) {
    try {
        res.clearCookie('authToken');
    }
    catch (err) {
        throw err;
    }
}
async function getUserFromToken(token) {
    const jwtPayload = _verifyToken(token);
    const { _id } = jwtPayload;
    if (!_id)
        throw new Error('Could not verify token');
    const user = await user_service_1.userService.getById(_id);
    if (!user)
        throw new Error('User not found in token');
    return user;
}
function applyTokenCookie(res, token, expiredAt) {
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: expiredAt || 1000 * 60 * 60 * 24, // 1 day
    });
}
////////////////////////////////////////////////////
// ! Private Methods
// Token
function _generateToken({ _id }) {
    const token = jsonwebtoken_1.default.sign({ _id }, JTW_SECRET_KEY);
    return token;
}
function _verifyToken(token) {
    try {
        const jwtPayload = jsonwebtoken_1.default.verify(token, JTW_SECRET_KEY);
        return jwtPayload;
    }
    catch (err) {
        logger_service_1.logger.error('Invalid token', err);
        throw err;
    }
}
async function _validateCredentials(credentials) {
    if (!_isValidCredentials(credentials)) {
        return { isValid: false, error: 'Missing credentials' };
    }
    if (await _isExistingUsername(credentials.username)) {
        return { isValid: false, error: 'Username already taken' };
    }
    return { isValid: true };
}
function _isValidCredentials(credentials) {
    return !!credentials.username && !!credentials.password && !!credentials.fullName;
}
async function _isExistingUsername(username) {
    try {
        const existingUser = await user_service_1.userService.getByUsername(username);
        return !!existingUser;
    }
    catch (err) {
        logger_service_1.logger.error(err);
    }
}
// Password Encryption/Decryption
async function _hashPassword(password, rounds = 10) {
    const hashedPassword = await bcrypt_1.default.hash(password, rounds);
    return hashedPassword;
}
function _decryptPassword(encryptedPassword) {
    const bytes = crypto_js_1.default.AES.decrypt(encryptedPassword, cryptoSecretKey);
    const decryptedPassword = bytes.toString(crypto_js_1.default.enc.Utf8);
    return decryptedPassword;
}
async function _isPasswordsMatch(password, hashedPassword) {
    const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
}
