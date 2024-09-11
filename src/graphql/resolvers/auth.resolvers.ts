import { logger } from '../../services/logger.service'
import { userService } from '../../services/user.service'
import { LoginArgs, SignupArgs } from '../../models/auth.model'

export const authResolvers = {
  Mutation: {
    async login(_: unknown, { credentials }: LoginArgs) {
      console.log(credentials)
    },

    async signup(_: unknown, { credentials }: SignupArgs) {
      // const { password } = credentials
      // const hashedPassword = await bcrypt.hash(password, 10)
      // console.log(`hashedPassword`, hashedPassword)
      try {
        const user = await userService.add(credentials)
        const token = 'dddd'
        return { token, user }
      } catch (err) {
        console.log('Had issues with adding user:', err)
        logger.error(err)
      }
    },
  },
}
