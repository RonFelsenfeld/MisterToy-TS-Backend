"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const mongodb_1 = require("mongodb");
const db_service_1 = require("./db.service");
const logger_service_1 = require("./logger.service");
exports.userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
    update,
    createSecuredUser,
};
const usersCollectionName = process.env.USERS_COLLECTION_NAME;
async function query() {
    logger_service_1.logger.debug('Querying users');
    try {
        const collection = await _getUserCollection();
        const users = await collection.find().toArray();
        return users;
    }
    catch (err) {
        throw err;
    }
}
async function getById(userId) {
    logger_service_1.logger.debug(`Fetching user with ID: ${userId}`);
    try {
        const collection = await _getUserCollection();
        const user = await collection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    catch (err) {
        throw err;
    }
}
async function getByUsername(username) {
    logger_service_1.logger.debug(`Fetching user with username: ${username}`);
    try {
        const collection = await _getUserCollection();
        const user = await collection.findOne({ username });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    catch (err) {
        throw err;
    }
}
async function remove(userId) {
    logger_service_1.logger.debug(`Removing user with ID: ${userId}`);
    try {
        const collection = await _getUserCollection();
        await collection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
    }
    catch (err) {
        throw err;
    }
}
async function add(userInfo) {
    logger_service_1.logger.debug('Adding new user:', userInfo);
    try {
        const userToAdd = {
            username: userInfo.username,
            password: userInfo.password,
            fullName: userInfo.fullName,
            isAdmin: false, // Default to false for new users
        };
        const collection = await _getUserCollection();
        const { insertedId } = await collection.insertOne(userToAdd);
        return { ...userToAdd, _id: new mongodb_1.ObjectId(insertedId) };
    }
    catch (err) {
        throw err;
    }
}
async function update(user) {
    logger_service_1.logger.debug(`Updating user with ID: ${user._id}`);
    try {
        const userToSave = {
            _id: new mongodb_1.ObjectId(user._id),
            username: user.username,
            password: user.password,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
        };
        const collection = await _getUserCollection();
        await collection.updateOne({ _id: new mongodb_1.ObjectId(user._id) }, { $set: userToSave });
        return userToSave;
    }
    catch (err) {
        throw err;
    }
}
// ! Returns the user without the password
function createSecuredUser(user) {
    return {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
    };
}
////////////////////////////////////////////////////
// ! Private Methods
async function _getUserCollection() {
    return await db_service_1.dbService.getCollection(usersCollectionName);
}
