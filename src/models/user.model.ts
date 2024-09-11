import { ObjectId } from 'mongodb'

interface UserCredentials {
  username: string
  password: string
  fullName?: string
}

export interface User extends Required<UserCredentials> {
  _id: ObjectId
}

export interface LoginArgs {
  credentials: UserCredentials
}

export interface SignupArgs {
  credentials: Required<UserCredentials>
}
