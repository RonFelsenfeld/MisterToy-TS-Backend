export const authDefs = `#graphql
type AuthResponse {
  user: SecuredUser!
  token: String!
}

type Mutation {
  login(credentials: LoginInput!): AuthResponse
  signup(credentials:  SignupInput!): AuthResponse
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
