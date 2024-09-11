import { AuthResponse, LoginArgs, SignupArgs } from '../../models/auth.model'

export const authResolvers = {
  Mutation: {
    async login(_: unknown, { credentials }: LoginArgs) {
      console.log(credentials)
    },

    async signup(_: unknown, { credentials }: SignupArgs): Promise<AuthResponse | void> {
      console.log(credentials)
    },
  },
}
