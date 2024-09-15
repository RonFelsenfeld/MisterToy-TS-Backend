import { utilService } from '../../services/util.service'
import { userService } from '../../services/user.service'

import { SecuredUser, SingleUserArgs, UpdateUserArgs } from '../../models/user.model'
import { Resolver } from '../../models/resolver.model'

const users: Resolver<SecuredUser[]> = async () => {
  try {
    const users = await userService.query()
    const securedUsers = users.map(userService.createSecuredUser)
    return securedUsers
  } catch (err) {
    throw utilService.handleError('Failed fetching users', err as string)
  }
}

const user: Resolver<SecuredUser, SingleUserArgs> = async (_, { _id }) => {
  try {
    const user = await userService.getById(_id)
    const securedUser = userService.createSecuredUser(user)
    return securedUser
  } catch (err) {
    throw utilService.handleError(`Failed fetching user with ID $${_id}`, err as string)
  }
}

const removeUser: Resolver<void, SingleUserArgs> = async (_, { _id }) => {
  try {
    await userService.remove(_id)
  } catch (err) {
    throw utilService.handleError(`Failed removing user with ID $${_id}`, err as string)
  }
}

const updateUser: Resolver<SecuredUser, UpdateUserArgs> = async (_, { user }) => {
  try {
    const updatedUser = await userService.update(user)
    const securedUser = userService.createSecuredUser(updatedUser)
    return securedUser
  } catch (err) {
    throw utilService.handleError('Failed update user', err as string)
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
