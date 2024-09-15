export const authDefs = `#graphql
type LogoutMsg {
  msg: String!
}

type Mutation {
  login(credentials: LoginInput!): SecuredUser!
  signup(credentials:  SignupInput!): SecuredUser!
  logout: LogoutMsg!
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
