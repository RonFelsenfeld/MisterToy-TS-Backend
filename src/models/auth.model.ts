import { UserCredentials, UserFullDetails } from './user.model'

export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: UserFullDetails
}
