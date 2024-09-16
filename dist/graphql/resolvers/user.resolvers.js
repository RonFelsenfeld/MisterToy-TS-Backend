"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const util_service_1 = require("../../services/util.service");
const user_service_1 = require("../../services/user.service");
const users = async () => {
    try {
        const users = await user_service_1.userService.query();
        const securedUsers = users.map(user_service_1.userService.createSecuredUser);
        return securedUsers;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed fetching users', err);
    }
};
const user = async (_, { _id }) => {
    try {
        const user = await user_service_1.userService.getById(_id);
        const securedUser = user_service_1.userService.createSecuredUser(user);
        return securedUser;
    }
    catch (err) {
        throw util_service_1.utilService.handleError(`Failed fetching user with ID $${_id}`, err);
    }
};
const removeUser = async (_, { _id }) => {
    try {
        await user_service_1.userService.remove(_id);
    }
    catch (err) {
        throw util_service_1.utilService.handleError(`Failed removing user with ID $${_id}`, err);
    }
};
const updateUser = async (_, { user }) => {
    try {
        const updatedUser = await user_service_1.userService.update(user);
        const securedUser = user_service_1.userService.createSecuredUser(updatedUser);
        return securedUser;
    }
    catch (err) {
        throw util_service_1.utilService.handleError('Failed update user', err);
    }
};
exports.userResolvers = {
    Query: {
        users,
        user,
    },
    Mutation: {
        removeUser,
        updateUser,
    },
};
