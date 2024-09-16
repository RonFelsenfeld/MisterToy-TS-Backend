"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDBConfig = createDBConfig;
function createDBConfig(dbURL) {
    return { dbURL, dbName: process.env.DB_NAME };
}
