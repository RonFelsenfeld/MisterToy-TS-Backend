export const authDefs = `#graphql
type AuthResponse {
  user: SecuredUser!
  token: String!
}

type LogoutMsg {
  msg: String!
}

type Mutation {
  login(credentials: LoginInput!): AuthResponse
  signup(credentials:  SignupInput!): AuthResponse
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
