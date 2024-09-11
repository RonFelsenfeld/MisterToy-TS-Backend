import { ObjectId } from 'mongodb'

interface UserCredentials {
  username: string
  password: string
  fullName?: string
}

export type UserFullDetails = Required<UserCredentials>

export interface User extends UserFullDetails {
  _id: ObjectId
}

export type SecuredUser = Omit<User, 'password'>

export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: UserFullDetails
}
