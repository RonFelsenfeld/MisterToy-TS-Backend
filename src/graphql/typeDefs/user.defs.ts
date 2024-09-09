export const userDefs = `#graphql
type User {
  _id: ID!
  username: String!
  password: String!
  fullName: String!
}

type Mutation {
  login(credentials: LoginUserInput!): Boolean
}

input LoginUserInput {
  username: String!
  password: String!
 }
`
