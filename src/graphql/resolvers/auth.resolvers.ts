import { authService } from '../../services/auth.service'
import { logger } from '../../services/logger.service'
import { utilService } from '../../services/util.service'

import { Resolver } from '../../models/resolver.model'
import { LoginArgs, SignupArgs } from '../../models/auth.model'
import { SecuredUser } from '../../models/user.model'

const login: Resolver<SecuredUser, LoginArgs> = async (_, { credentials }, { res }) => {
  try {
    const { username, password } = credentials
    const { user, token } = await authService.login(username, password)
    logger.info(`User with id ${user._id} logged in successfully`)

    authService.applyTokenCookie(res, token)
    return user
  } catch (err) {
    throw utilService.handleError('Failed to login', err as string)
  }
}

const signup: Resolver<SecuredUser, SignupArgs> = async (_, { credentials }, { res }) => {
  try {
    const account = await authService.signup(credentials)
    logger.debug('New account created', JSON.stringify(account))

    const { username, password } = credentials
    const { user, token } = await authService.login(username, password)

    logger.info(`User with id ${user._id} logged in successfully`)
    authService.applyTokenCookie(res, token)
    return user
  } catch (err) {
    throw utilService.handleError('Failed to signup', err as string)
  }
}

const logout: Resolver<{ msg: string }> = async (_, _2, { res, user }) => {
  try {
    await authService.logout(res)
    logger.info(`User with id ${user?._id} logged out successfully`)
    return { msg: 'Logged out successfully' }
  } catch (err) {
    throw utilService.handleError('Failed to logout', err as string)
  }
}

export const authResolvers = {
  Mutation: {
    login,
    signup,
    logout,
  },
}
