import { UserCredentials, UserFullDetails } from './user.model'

export interface AuthResponse {
  user: UserFullDetails
  token: string
}
export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: UserFullDetails
}
