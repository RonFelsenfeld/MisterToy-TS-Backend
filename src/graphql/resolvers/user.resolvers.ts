import { LoginArgs, SignupArgs } from '../../models/user.model'

export const userResolvers = {
  Mutation: {
    async login(_: unknown, { credentials }: LoginArgs) {
      console.log(credentials)
    },

    async signup(_: unknown, { credentials }: SignupArgs) {
      console.log(credentials)
    },
  },
}
