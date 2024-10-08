import { ObjectId } from 'mongodb'

export interface UserCredentials {
  username: string
  password: string
  fullName?: string
}

export type UserFullCredentials = Required<UserCredentials>

export interface UserFullDetails extends UserFullCredentials {
  isAdmin: boolean
}

export interface User extends UserFullDetails {
  _id: ObjectId
}

export type SecuredUser = Omit<User, 'password'>

export interface SingleUserArgs {
  _id: string
}

export interface UpdateUserArgs {
  user: User
}
