import { MongoClient, Db, Collection, Document } from 'mongodb'

import { logger } from '../services/logger.service'
import config from '../config/index'

export const dbService = {
  getCollection,
}

let dbConnection: Db | null = null

async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  try {
    const db = await connectToDB()
    const collection = db.collection<T>(collectionName)
    return collection
  } catch (err) {
    logger.error('Failed to get Mongo collection:', err)
    throw err
  }
}

async function connectToDB() {
  if (dbConnection) return dbConnection

  try {
    const { dbName, dbURL } = config
    const client = await MongoClient.connect(dbURL)
    const db = client.db(dbName)
    dbConnection = db
    return db
  } catch (err) {
    logger.error('Cannot Connect to DB', err)
    throw err
  }
}
