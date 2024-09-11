// import bcrypt from 'bcrypt'
import { userService } from '../../services/user.service'
import { logger } from '../../services/logger.service'
import { SingleUserArgs, LoginArgs, SignupArgs, UpdateUserArgs } from '../../models/user.model'

export const userResolvers = {
  Query: {
    async users() {
      try {
        const users = await userService.query()
        return users
      } catch (err) {
        console.log('Had issues with loading users:', err)
        logger.error(err)
      }
    },

    async user(_: unknown, { _id }: SingleUserArgs) {
      try {
        const user = await userService.getById(_id)
        return user
      } catch (err) {
        console.log('Had issues with loading user:', err)
        logger.error(err)
      }
    },
  },

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

    async removeUser(_: unknown, { _id }: SingleUserArgs) {
      try {
        await userService.remove(_id)
      } catch (err) {
        console.log('Had issues with removing user:', err)
        logger.error(err)
      }
    },

    async updateUser(_: unknown, { user }: UpdateUserArgs) {
      try {
        const updatedUser = await userService.update(user)
        return updatedUser
      } catch (err) {
        console.log('Had issues with updating user:', err)
        logger.error(err)
      }
    },
  },
}
