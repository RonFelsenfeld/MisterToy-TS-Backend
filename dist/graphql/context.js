"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = context;
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const logger_service_1 = require("../services/logger.service");
async function context({ req, res }) {
    let token = req.headers.cookie;
    if (token) {
        try {
            token = token.split('=')[1]; // ! Extracting the token from headers
            const user = await auth_service_1.authService.getUserFromToken(token);
            if (!user) {
                logger_service_1.logger.debug('FROM CONTEXT -> THERE IS NO USER IN TOKEN');
                throw new Error('Could not get user from token');
            }
            const securedUser = user_service_1.userService.createSecuredUser(user);
            logger_service_1.logger.info(`Logged-in user:`, securedUser);
            return { user: securedUser, res };
        }
        catch (err) {
            logger_service_1.logger.error('Error while verifying token', err);
        }
    }
    logger_service_1.logger.debug('FROM CONTEXT -> NO LOGGED IN USER');
    return { res };
}
