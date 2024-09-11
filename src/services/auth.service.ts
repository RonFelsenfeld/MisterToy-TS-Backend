import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { logger } from './logger.service'
import { SecuredUser, User, UserFullDetails } from '../models/user.model'
import { userService } from './user.service'

const JTW_KEY = process.env.JWT_SECRET_KEY!

export const authService = {
  signup,
  generateToken,
  verifyToken,
}

async function signup({ username, password }: UserFullDetails) {
  logger.debug(`Signup with username: ${username}`)

  const securedUser = await userService.getByUsername(username)
}

function generateToken(user: User) {
  const userInfo = userService.createSecuredUser(user)
  const token = jwt.sign(userInfo, JTW_KEY)
  console.log(`TOKEN`, token)
  return token
}

function verifyToken(token: string): SecuredUser | void {
  try {
    const user = jwt.verify(token, JTW_KEY)
    console.log(`user`, user)
    return user as SecuredUser
  } catch (err) {
    logger.error('Invalid token', err)
    throw err
  }
}
