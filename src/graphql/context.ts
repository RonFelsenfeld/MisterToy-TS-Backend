import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'
import { SecuredUser } from '../models/user.model'

export interface ServerContext {
  user?: SecuredUser
  res: Response
}

interface ContextArgs {
  req: Request
  res: Response
}

export async function context({ req, res }: ContextArgs): Promise<ServerContext> {
  let token = req.headers.cookie

  if (token) {
    try {
      token = token.split('=')[1] // Extracting the token from headers
      const user = await authService.getUserFromToken(token)
      if (!user) throw new Error('Could not get user from token')

      const securedUser = userService.createSecuredUser(user)
      return { user: securedUser, res }
    } catch (err) {
      console.log('Error while verifying token', err)
    }
  }

  return { res }
}
