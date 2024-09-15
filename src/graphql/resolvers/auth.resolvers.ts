import { GraphQLError } from 'graphql'
import { authService } from '../../services/auth.service'
import { logger } from '../../services/logger.service'

import { Resolver } from '../../models/resolver.model'
import { AuthResponse, LoginArgs, SignupArgs } from '../../models/auth.model'

const login: Resolver<AuthResponse, LoginArgs> = async (_, { credentials }, { res }) => {
  try {
    const { username, password } = credentials
    const loginResponse = await authService.login(username, password)

    authService.applyTokenCookie(res, loginResponse.token)
    return loginResponse
  } catch (err) {
    const errMsg = `Failed to login: ${err}`
    logger.error(errMsg)
    throw new GraphQLError(errMsg)
  }
}

const signup: Resolver<AuthResponse, SignupArgs> = async (_, { credentials }) => {
  try {
    const account = await authService.signup(credentials)
    logger.debug('New account created', JSON.stringify(account))

    const { username, password } = credentials
    const loginResponse = await authService.login(username, password)
    return loginResponse
  } catch (err) {
    const errMsg = `Failed to signup: ${err}`
    logger.error(errMsg)
    throw new GraphQLError(errMsg)
  }
}

export const authResolvers = {
  Mutation: {
    login,
    signup,
  },
}
