import { ObjectId } from 'mongodb'
import { dbService } from './db.service'
import { logger } from './logger.service'
import { SecuredUser, User, UserFullCredentials, UserFullDetails } from '../models/user.model'

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  add,
  update,
  createSecuredUser,
}

const usersCollectionName = process.env.USERS_COLLECTION_NAME!

async function query() {
  logger.debug('Querying users')

  try {
    const collection = await _getUserCollection()
    const users = await collection.find().toArray()
    return users
  } catch (err) {
    throw err
  }
}

async function getById(userId: string) {
  logger.debug(`Fetching user with ID: ${userId}`)

  try {
    const collection = await _getUserCollection()
    const user = await collection.findOne({ _id: new ObjectId(userId) })
    if (!user) throw new Error('User not found')
    return user
  } catch (err) {
    throw err
  }
}

async function getByUsername(username: string) {
  logger.debug(`Fetching user with username: ${username}`)

  try {
    const collection = await _getUserCollection()
    const user = await collection.findOne({ username })
    if (!user) throw new Error('User not found')
    return user
  } catch (err) {
    throw err
  }
}

async function remove(userId: string) {
  logger.debug(`Removing user with ID: ${userId}`)

  try {
    const collection = await _getUserCollection()
    await collection.deleteOne({ _id: new ObjectId(userId) })
  } catch (err) {
    throw err
  }
}

async function add(userInfo: UserFullCredentials) {
  logger.debug('Adding new user:', userInfo)

  try {
    const userToAdd: UserFullDetails = {
      username: userInfo.username,
      password: userInfo.password,
      fullName: userInfo.fullName,
      isAdmin: false, // Default to false for new users
    }

    const collection = await _getUserCollection()
    const { insertedId } = await collection.insertOne(userToAdd as User)
    return { ...userToAdd, _id: new ObjectId(insertedId) } as User
  } catch (err) {
    throw err
  }
}

async function update(user: User) {
  logger.debug(`Updating user with ID: ${user._id}`)

  try {
    const userToSave = {
      _id: new ObjectId(user._id),
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    }

    const collection = await _getUserCollection()
    await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: userToSave })

    return userToSave
  } catch (err) {
    throw err
  }
}

// ! Returns the user without the password
function createSecuredUser(user: User): SecuredUser {
  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    isAdmin: user.isAdmin,
  }
}

////////////////////////////////////////////////////

// ! Private Methods

async function _getUserCollection() {
  return await dbService.getCollection<User>(usersCollectionName)
}
