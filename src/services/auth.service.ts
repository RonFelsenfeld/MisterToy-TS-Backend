import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { logger } from './logger.service'
import { userService } from './user.service'

import { SecuredUser, User, UserFullDetails } from '../models/user.model'
import { AuthFields, AuthResponse } from '../models/auth.model'

export const authService = {
  signup,
  login,
  verifyToken,
}

const JTW_SECRET_KEY = process.env.JWT_SECRET_KEY!
const cryptoSecretKey = process.env.CRYPTO_SECRET_KEY!

async function signup(credentials: UserFullDetails) {
  logger.debug(`Signing-up with username: ${credentials.username}`)

  try {
    const { isValid, error } = await _validateCredentials(credentials)
    if (!isValid) return Promise.reject(error)

    const newUser = await userService.add(credentials)
    return newUser
  } catch (err) {
    logger.error('Cannot signup', err)
    throw err
  }
}

async function login({ username, password: encryptedPassword }: AuthFields): Promise<AuthResponse> {
  logger.debug(`Logging-in with username: ${username}`)

  try {
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject(`User not found with username: ${username}`)

    const bytes = CryptoJS.AES.decrypt(encryptedPassword, cryptoSecretKey)
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)

    const isMatch = await bcrypt.compare(decryptedPassword, user.password)
    if (!isMatch) return Promise.reject('Passwords do not match')

    const token = _generateToken(user)
    const securedUser = userService.createSecuredUser(user)
    return { token, user: securedUser }
  } catch (err) {
    logger.error('Cannot login', err)
    throw err
  }
}

function verifyToken(token: string): SecuredUser | void {
  try {
    const user = jwt.verify(token, JTW_SECRET_KEY)
    return user as SecuredUser
  } catch (err) {
    logger.error('Invalid token', err)
    throw err
  }
}

////////////////////////////////////////////////////

// ! Private Methods

function _generateToken(user: User) {
  const userInfo = userService.createSecuredUser(user)
  const token = jwt.sign(userInfo, JTW_SECRET_KEY)
  return token
}

interface ValidationInfo {
  isValid: boolean
  error?: string
}

async function _validateCredentials(credentials: UserFullDetails): Promise<ValidationInfo> {
  if (!_isValidCredentials(credentials)) {
    return { isValid: false, error: 'Missing credentials' }
  }

  if (await _isExistingUsername(credentials.username)) {
    return { isValid: false, error: 'Username already taken' }
  }

  return { isValid: true }
}

function _isValidCredentials(credentials: UserFullDetails) {
  return !!credentials.username && !!credentials.password && !!credentials.fullName
}

async function _isExistingUsername(username: string) {
  const existingUser = await userService.getByUsername(username)
  return !!existingUser
}
