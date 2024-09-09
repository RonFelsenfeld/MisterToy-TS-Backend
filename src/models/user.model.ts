interface UserCredentials {
  username: string
  password: string
  fullName?: string
}

export interface LoginArgs {
  credentials: UserCredentials
}
