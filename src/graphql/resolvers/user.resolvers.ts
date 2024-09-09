import { LoginArgs } from '../../models/user.model'

export const userResolvers = {
  Mutation: {
    async login(_: unknown, { credentials }: LoginArgs) {
      console.log(credentials)
    },
  },
}
