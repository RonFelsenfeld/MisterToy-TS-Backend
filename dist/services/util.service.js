"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilService = void 0;
const graphql_1 = require("graphql");
const fs_1 = __importDefault(require("fs"));
const logger_service_1 = require("./logger.service");
exports.utilService = {
    makeId,
    readJsonFile,
    handleError,
};
function makeId(length = 6) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
function readJsonFile(path) {
    const str = fs_1.default.readFileSync(path, 'utf8');
    const json = JSON.parse(str);
    return json;
}
function handleError(msg, err) {
    const errMsg = `${msg}: ${err}`;
    logger_service_1.logger.error(errMsg);
    throw new graphql_1.GraphQLError(errMsg);
}
