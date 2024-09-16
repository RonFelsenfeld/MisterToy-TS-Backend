"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_model_1 = require("../models/db.model");
dotenv_1.default.config();
const configProd = (0, db_model_1.createDBConfig)(process.env.MONGO_CLOUD_URL);
exports.default = configProd;
