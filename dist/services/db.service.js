"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const mongodb_1 = require("mongodb");
const logger_service_1 = require("../services/logger.service");
const index_1 = __importDefault(require("../config/index"));
exports.dbService = {
    getCollection,
};
let dbConnection = null;
async function getCollection(collectionName) {
    try {
        const db = await connectToDB();
        const collection = db.collection(collectionName);
        logger_service_1.logger.info(`Connected to MongoDB and fetched collection: ${collectionName}`);
        return collection;
    }
    catch (err) {
        logger_service_1.logger.error('Failed to get Mongo collection:', err);
        throw err;
    }
}
async function connectToDB() {
    if (dbConnection)
        return dbConnection;
    try {
        const { dbName, dbURL } = index_1.default;
        const client = await mongodb_1.MongoClient.connect(dbURL);
        const db = client.db(dbName);
        dbConnection = db;
        return db;
    }
    catch (err) {
        logger_service_1.logger.error('Cannot Connect to DB', err);
        throw err;
    }
}
