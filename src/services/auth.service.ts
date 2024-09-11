import jwt from 'jsonwebtoken'
import { logger } from './logger.service'
import { User } from '../models/user.model'

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

  const token = jwt.sign(userInfo, process.env.JWT_SECRET_KEY!)
  console.log(`TOKEN`, token)
  return token
}

function verifyToken(token: string): User | undefined {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY!)
    console.log(`user`, user)
    return user as User
  } catch (err) {
    logger.error('Invalid token', err)
    throw err
  }
}
