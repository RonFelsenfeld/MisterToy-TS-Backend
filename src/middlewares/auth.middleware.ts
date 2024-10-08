import { AuthenticationError } from 'apollo-server-express'
import { Resolver } from '../models/resolver.model'

export function authMiddleware<T, U>(resolver: Resolver<T, U>) {
  const protectedResolver: Resolver<T, U> = async (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('Must be logged-in user')
    }

    return resolver(parent, args, context, info)
  }

  return protectedResolver
}
