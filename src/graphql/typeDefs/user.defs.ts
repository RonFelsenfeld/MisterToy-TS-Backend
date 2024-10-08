export const userDefs = `#graphql
type User {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
  isAdmin: Boolean!
}

type SecuredUser {
  _id: ID!
  username: String!
  fullName: String!
  isAdmin: Boolean!
}

type MiniUser {
  _id: ID!
  fullName: String!
}

type Query {
  users: [SecuredUser]
  user(_id: ID!): SecuredUser
}

type Mutation {
  removeUser(_id: ID!): Boolean
  updateUser(user: UpdateUserInput!): SecuredUser
}

 input UpdateUserInput {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
  isAdmin: Boolean!
 }

input MiniUserInput {
  _id: ID!
  fullName: String!
}
`
