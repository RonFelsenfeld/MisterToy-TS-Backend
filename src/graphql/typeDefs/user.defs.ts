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
 }
`
