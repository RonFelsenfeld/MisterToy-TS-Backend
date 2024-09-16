"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolvers = void 0;
const auth_service_1 = require("../../services/auth.service");
const logger_service_1 = require("../../services/logger.service");
const util_service_1 = require("../../services/util.service");
const login = async (_, { credentials }, { res }) => {
    try {
        const { username, password } = credentials;
        const { user, token } = await auth_service_1.authService.login(username, password);
        logger_service_1.logger.info(`User with id ${user._id} logged in successfully`);
        auth_service_1.authService.applyTokenCookie(res, token);
        return user;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed to login', err);
    }
};
const signup = async (_, { credentials }, { res }) => {
    try {
        const account = await auth_service_1.authService.signup(credentials);
        logger_service_1.logger.debug('New account created', JSON.stringify(account));
        const { username, password } = credentials;
        const { user, token } = await auth_service_1.authService.login(username, password);
        logger_service_1.logger.info(`User with id ${user._id} logged in successfully`);
        auth_service_1.authService.applyTokenCookie(res, token);
        return user;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed to signup', err);
    }
};
const logout = async (_, _2, { res, user }) => {
    try {
        await auth_service_1.authService.logout(res);
        logger_service_1.logger.info(`User with id ${user?._id} logged out successfully`);
        return { msg: 'Logged out successfully' };
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed to logout', err);
    }
};
// ! Sending the logged in user to the client (can be undefined)
const fetchLoggedInUser = async (_, _2, { user }) => {
    logger_service_1.logger.debug('Fetching logged in user');
    return user;
};
exports.authResolvers = {
    Mutation: {
        login,
        signup,
        logout,
        fetchLoggedInUser,
    },
};
