import jwt from 'jsonwebtoken'
import { logger } from './logger.service'
import { User, UserFullDetails } from '../models/user.model'

const JTW_KEY = process.env.JWT_SECRET_KEY!

export const authService = {
  generateToken,
  verifyToken,
}

function generateToken(user: User) {
  const userInfo = {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
  }

  const token = jwt.sign(userInfo, JTW_KEY)
  console.log(`TOKEN`, token)
  return token
}

function verifyToken(token: string): UserFullDetails | undefined {
  try {
    const user = jwt.verify(token, JTW_KEY)
    console.log(`user`, user)
    return user as UserFullDetails
  } catch (err) {
    logger.error('Invalid token', err)
    throw err
  }
}
