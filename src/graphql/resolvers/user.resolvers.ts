import { GraphQLError } from 'graphql'
import { userService } from '../../services/user.service'
import { logger } from '../../services/logger.service'

import { SecuredUser, SingleUserArgs, UpdateUserArgs } from '../../models/user.model'
import { Resolver } from '../../models/resolver.model'

const users: Resolver<SecuredUser[]> = async () => {
  try {
    const users = await userService.query()
    const securedUsers = users.map(userService.createSecuredUser)
    return securedUsers
  } catch (err) {
    logger.error('Had issues with loading users:', err)
    throw new GraphQLError(`Failed fetching users: ${err}`)
  }
}

const user: Resolver<SecuredUser, SingleUserArgs> = async (_, { _id }) => {
  try {
    const user = await userService.getById(_id)
    const securedUser = userService.createSecuredUser(user)
    return securedUser
  } catch (err) {
    logger.error('Had issues with loading user:', err)
    throw new GraphQLError(`Failed fetching user with ID $${_id}: ${err}`)
  }
}

const removeUser: Resolver<void, SingleUserArgs> = async (_, { _id }) => {
  try {
    await userService.remove(_id)
  } catch (err) {
    logger.error('Had issues with removing user:', err)
    throw new GraphQLError(`Failed removing user with ID $${_id}: ${err}`)
  }
}

const updateUser: Resolver<SecuredUser, UpdateUserArgs> = async (_, { user }) => {
  try {
    const updatedUser = await userService.update(user)
    const securedUser = userService.createSecuredUser(updatedUser)
    return securedUser
  } catch (err) {
    logger.error('Had issues with updating user:', err)
    throw new GraphQLError(`Failed update user: ${err}`)
  }
}

export const userResolvers = {
  Query: {
    users,
    user,
  },

  Mutation: {
    removeUser,
    updateUser,
  },
}
