import { ObjectId } from 'mongodb'

import { dbService } from './db.service'
import { logger } from './logger.service'
import { SecuredUser, User, UserFullDetails } from '../models/user.model'

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  add,
  update,
}

const usersCollectionName = process.env.USERS_COLLECTION_NAME!

async function query() {
  logger.debug('Querying users')

  try {
    const collection = await _getUserCollection()
    const users = await collection.find().toArray()
    const securedUsers: SecuredUser[] = users.map(_createSecuredUser)
    return securedUsers
  } catch (err) {
    logger.error('Cannot fetch users', err)
    throw err
  }
}

async function getById(userId: string) {
  logger.debug(`Fetching user with ID: ${userId}`)

  try {
    const collection = await _getUserCollection()
    const user = await collection.findOne({ _id: new ObjectId(userId) })
    if (!user) throw new Error('User not found')

    const securedUser = _createSecuredUser(user)
    return securedUser
  } catch (err) {
    logger.error(`Cannot fetch user with ID: ${userId}`, err)
    throw err
  }
}

async function getByUsername(username: string) {
  logger.debug(`Fetching user with username: ${username}`)

  try {
    const collection = await _getUserCollection()
    const user = await collection.findOne({ username })
    if (!user) throw new Error('User not found')

    const securedUser = _createSecuredUser(user)
    return securedUser
  } catch (err) {
    logger.error(`Cannot fetch user with username: ${username}`, err)
    throw err
  }
}

async function remove(userId: string) {
  logger.debug(`Removing user with ID: ${userId}`)

  try {
    const collection = await _getUserCollection()
    await collection.deleteOne({ _id: new ObjectId(userId) })
  } catch (err) {
    logger.error(`Cannot remove user ${userId}`, err)
    throw err
  }
}

async function add(userInfo: UserFullDetails) {
  logger.debug('Adding new user:', userInfo)

  try {
    const collection = await _getUserCollection()
    const { insertedId } = await collection.insertOne(userInfo as User)
    const securedUser = _createSecuredUser({ ...userInfo, _id: insertedId })
    return securedUser
  } catch (err) {
    logger.error('Cannot insert user', err)
    throw err
  }
}

async function update(user: User) {
  logger.debug(`Updating user with ID: ${user._id}`)

  try {
    const userToSave = {
      _id: user._id,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
    }

    const collection = await _getUserCollection()
    await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: userToSave })

    const securedUser = _createSecuredUser(user)
    return securedUser
  } catch (err) {
    logger.error(`Cannot update user ${user._id}`, err)
    throw err
  }
}

////////////////////////////////////////////////////

// ! Private Methods

async function _getUserCollection() {
  return await dbService.getCollection<User>(usersCollectionName)
}

function _createSecuredUser(user: User): SecuredUser {
  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
  }
}
