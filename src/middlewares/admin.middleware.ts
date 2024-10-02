import { AuthenticationError } from 'apollo-server-express'
import { authService } from '../services/auth.service'
import { Resolver } from '../models/resolver.model'

export function adminMiddleware<T, U>(resolver: Resolver<T, U>) {
  const protectedResolver: Resolver<T, U> = async (parent, args, context, info) => {
    if (!authService.isAuthorized(context.user)) {
      throw new AuthenticationError('Unauthorized')
    }

    return resolver(parent, args, context, info)
  }

  return protectedResolver
}
