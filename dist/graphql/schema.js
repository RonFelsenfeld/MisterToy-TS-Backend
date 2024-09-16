"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const lodash_1 = __importDefault(require("lodash"));
const toy_defs_1 = require("./typeDefs/toy.defs");
const user_defs_1 = require("./typeDefs/user.defs");
const auth_defs_1 = require("./typeDefs/auth.defs");
const toy_resolvers_1 = require("./resolvers/toy.resolvers");
const user_resolvers_1 = require("./resolvers/user.resolvers");
const auth_resolvers_1 = require("./resolvers/auth.resolvers");
const typeDefs = [toy_defs_1.toyDefs, user_defs_1.userDefs, auth_defs_1.authDefs];
const resolvers = lodash_1.default.merge(toy_resolvers_1.toyResolvers, user_resolvers_1.userResolvers, auth_resolvers_1.authResolvers);
exports.schema = { typeDefs, resolvers };
