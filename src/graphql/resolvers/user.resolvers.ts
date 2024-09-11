import { userService } from '../../services/user.service'
import { logger } from '../../services/logger.service'
import { SingleUserArgs, UpdateUserArgs } from '../../models/user.model'

export const userResolvers = {
  Query: {
    async users() {
      try {
        const users = await userService.query()
        const securedUsers = users.map(userService.createSecuredUser)
        return securedUsers
      } catch (err) {
        logger.error('Had issues with loading users:', err)
        throw new Error(`Failed fetching users: ${err}`)
      }
    },

    async user(_: unknown, { _id }: SingleUserArgs) {
      try {
        const user = await userService.getById(_id)
        const securedUser = userService.createSecuredUser(user)
        return securedUser
      } catch (err) {
        logger.error('Had issues with loading user:', err)
        throw new Error(`Failed fetching user with ID $${_id}: ${err}`)
      }
    },
  },

  Mutation: {
    async removeUser(_: unknown, { _id }: SingleUserArgs) {
      try {
        await userService.remove(_id)
      } catch (err) {
        logger.error('Had issues with removing user:', err)
        throw new Error(`Failed removing user with ID $${_id}: ${err}`)
      }
    },

    async updateUser(_: unknown, { user }: UpdateUserArgs) {
      try {
        const updatedUser = await userService.update(user)
        const securedUser = userService.createSecuredUser(updatedUser)
        return securedUser
      } catch (err) {
        logger.error('Had issues with updating user:', err)
        throw new Error(`Failed update user: ${err}`)
      }
    },
  },
}
