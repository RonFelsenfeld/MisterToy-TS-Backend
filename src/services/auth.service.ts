import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Response } from 'express'

import { logger } from './logger.service'
import { userService } from './user.service'

import { User, UserFullDetails } from '../models/user.model'
import { AuthResponse } from '../models/auth.model'

export const authService = {
  login,
  signup,
  getUserFromToken,
  applyTokenCookie,
}

const JTW_SECRET_KEY = process.env.JWT_SECRET_KEY!
const cryptoSecretKey = process.env.CRYPTO_SECRET_KEY!

async function login(username: string, encryptedPassword: string): Promise<AuthResponse> {
  logger.debug(`Logging-in with username: ${username}`)

  try {
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject(`User not found with username: ${username}`)

    const decryptedPassword = _decryptPassword(encryptedPassword)
    const isMatch = await _isPasswordsMatch(decryptedPassword, user.password)
    if (!isMatch) return Promise.reject('Passwords do not match')

    // The passwords matches
    const token = _generateToken(user)
    const securedUser = userService.createSecuredUser(user)
    return { token, user: securedUser }
  } catch (err) {
    logger.error('Cannot login', err)
    throw err
  }
}

async function signup(credentials: UserFullDetails) {
  logger.debug(`Signing-up with username: ${credentials.username}`)

  try {
    const { isValid, error } = await _validateCredentials(credentials)
    if (!isValid) return Promise.reject(error)

    const { password } = credentials
    const decryptedPassword = _decryptPassword(password)
    const hashedPassword = await _hashPassword(decryptedPassword)

    const newUser = await userService.add({ ...credentials, password: hashedPassword })
    return newUser
  } catch (err) {
    logger.error('Cannot signup', err)
    throw err
  }
}

async function getUserFromToken(token: string) {
  const jwtPayload = _verifyToken(token)
  const { _id } = jwtPayload
  if (!_id) throw new Error('Could not verify token')

  const user = await userService.getById(_id)
  if (!user) throw new Error('User not found in token')

  return user
}

function applyTokenCookie(res: Response, token: string, expiredAt?: number) {
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: expiredAt || 1000 * 60 * 60 * 24, // 1 day
  })
}

////////////////////////////////////////////////////

// ! Private Methods

// Token
function _generateToken({ _id }: User) {
  const token = jwt.sign({ _id }, JTW_SECRET_KEY)
  return token
}

function _verifyToken(token: string) {
  try {
    const jwtPayload = jwt.verify(token, JTW_SECRET_KEY)
    return jwtPayload as { _id: string }
  } catch (err) {
    logger.error('Invalid token', err)
    throw err
  }
}

// Validation
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
  try {
    const existingUser = await userService.getByUsername(username)
    return !!existingUser
  } catch (err) {
    logger.error(err)
  }
}

// Password Encryption/Decryption

async function _hashPassword(password: string, rounds: number = 10) {
  const hashedPassword = await bcrypt.hash(password, rounds)
  return hashedPassword
}

function _decryptPassword(encryptedPassword: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, cryptoSecretKey)
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)
  return decryptedPassword
}

async function _isPasswordsMatch(password: string, hashedPassword: string) {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}
