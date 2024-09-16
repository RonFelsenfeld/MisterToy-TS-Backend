import { SecuredUser, UserCredentials, UserFullCredentials } from './user.model'

export interface AuthResponse {
  user: SecuredUser
  token: string
}
export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: UserFullCredentials
}
