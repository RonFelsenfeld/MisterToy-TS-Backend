import { SecuredUser, UserCredentials, UserFullDetails } from './user.model'

export interface AuthResponse {
  user: SecuredUser
  token: string
}
export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: UserFullDetails
}

export type AuthFields = Omit<UserFullDetails, 'fullName'>
