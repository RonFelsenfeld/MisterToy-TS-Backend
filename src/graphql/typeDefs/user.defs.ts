export const userDefs = `#graphql
type User {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
}

type Mutation {
  login(credentials: LoginInput!): Boolean
  signup(credentials:  SignupInput!): Boolean
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
`
