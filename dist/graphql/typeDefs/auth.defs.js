"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDefs = void 0;
exports.authDefs = `#graphql
type LogoutMsg {
  msg: String!
}

type Mutation {
  login(credentials: LoginInput!): SecuredUser!
  signup(credentials:  SignupInput!): SecuredUser!
  logout: LogoutMsg!
  fetchLoggedInUser: SecuredUser
}

input LoginInput {
  username: String!
  password: String!
 }

 input SignupInput {
  username: String!
  password: String!
  fullName: String!
 }
`;
