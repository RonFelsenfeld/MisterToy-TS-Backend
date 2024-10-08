import { Filter, ObjectId, Sort } from 'mongodb'

import { logger } from './logger.service'
import { dbService } from './db.service'
import { Toy, ToyFilterBy, ToyMsg } from '../models/toy.model'
import { utilService } from './util.service'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
  addMsg,
  removeMsg,
}

const toysCollectionName = process.env.TOYS_COLLECTION_NAME!

async function query(filterBy?: ToyFilterBy, sortBy: Sort = {}) {
  logger.debug('Querying toys')

  try {
    const filterCriteria = _getFilterCriteria(filterBy)

    const collection = await _getToysCollection()
    let toys = await collection.find(filterCriteria).sort(sortBy).toArray()

    return toys
  } catch (err) {
    throw err
  }
}

async function getById(toyId: string) {
  logger.debug(`Fetching toy with ID: ${toyId}`)

  try {
    const collection = await _getToysCollection()
    const toy = collection.findOne({ _id: new ObjectId(toyId) })
    return toy
  } catch (err) {
    throw err
  }
}

async function remove(toyId: string) {
  logger.debug(`Removing toy with ID: ${toyId}`)

  try {
    const collection = await _getToysCollection()
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    throw err
  }
}

async function add(toy: Partial<Toy>) {
  logger.debug('Adding new toy:', toy)

  try {
    const collection = await _getToysCollection()
    const { insertedId } = await collection.insertOne(toy as Toy)

    toy.createdAt = insertedId.getTimestamp().getTime()
    await collection.updateOne({ _id: new ObjectId(insertedId) }, { $set: toy })
    return toy as Toy
  } catch (err) {
    throw err
  }
}

async function update(toy: Toy) {
  logger.debug(`Updating toy with ID: ${toy._id}`)

  try {
    const toyToSave = {
      name: toy.name,
      price: toy.price,
      inStock: toy.inStock,
      labels: [...toy.labels],
    }

    const collection = await _getToysCollection()
    await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
    return toy
  } catch (err) {
    throw err
  }
}

async function addMsg(toyId: string, msg: ToyMsg) {
  logger.debug(`Adding msg (${msg.txt}) to toy ${toyId}`)

  try {
    msg.id = utilService.makeId()
    const collection = await _getToysCollection()
    await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msg } })
    return msg
  } catch (err) {
    throw err
  }
}

async function removeMsg(toyId: string, msgId: string) {
  logger.debug(`Removing msg (${msgId}) from toy ${toyId}`)

  try {
    const collection = await _getToysCollection()
    await collection.updateOne({ _id: new ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
  } catch (err) {
    throw err
  }
}
////////////////////////////////////////////////////

// ! Private Methods

async function _getToysCollection() {
  return await dbService.getCollection<Toy>(toysCollectionName)
}

function _getFilterCriteria(filterBy?: ToyFilterBy): Filter<Toy> {
  if (!filterBy) return {}

  const filterCriteria: Filter<Toy> = {}
  const { name, inStock, maxPrice, labels } = filterBy

  if (name) filterCriteria.name = { $regex: name, $options: 'i' }
  if (inStock !== null) filterCriteria.inStock = inStock
  if (maxPrice) filterCriteria.price = { $lte: +maxPrice }
  if (labels.length) filterCriteria.labels = { $all: labels }

  return filterCriteria
}
