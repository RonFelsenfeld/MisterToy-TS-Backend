export const userDefs = `#graphql
type User {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
}

type SecuredUser {
  _id: ID!
  username: String!
  fullName: String!
}

type AuthResponse {
  user: SecuredUser!
  token: String!
}

type Query {
  users: [SecuredUser]
  user(_id: ID!): SecuredUser
}

type Mutation {
  login(credentials: LoginInput!): AuthResponse
  signup(credentials:  SignupInput!): AuthResponse
  removeUser(_id: ID!): Boolean
  updateUser(user: UpdateUserInput!): SecuredUser
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

 input UpdateUserInput {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
 }
`
