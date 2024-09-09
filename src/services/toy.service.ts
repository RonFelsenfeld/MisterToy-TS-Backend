import { Filter, ObjectId } from 'mongodb'

import { logger } from './logger.service'
import { dbService } from './db.service'
import { Toy, ToyFilterBy, ToySortBy } from '../models/toy.model'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
}

const toysCollectionName = process.env.TOYS_COLLECTION_NAME!

async function query(filterBy?: ToyFilterBy, sortBy?: ToySortBy) {
  logger.debug('Querying toys')

  try {
    const filterCriteria = _getFilterCriteria(filterBy)

    const collection = await dbService.getCollection<Toy>(toysCollectionName)
    let toys = await collection.find(filterCriteria).toArray()
    // TODO: Filter and sort using MongoDB

    // if (filterBy) toys = _filterToys(toys, filterBy)
    if (sortBy) toys = _sortToys(toys, sortBy)

    return toys
  } catch (err) {
    logger.error('Cannot fetch toys', err)
    throw err
  }
}

async function getById(toyId: string) {
  logger.debug(`Fetching toy with ID: ${toyId}`)

  try {
    const collection = await dbService.getCollection<Toy>(toysCollectionName)
    const toy = collection.findOne({ _id: new ObjectId(toyId) })
    return toy
  } catch (err) {
    logger.error(`Cannot fetch toy with ID: ${toyId}`, err)
    throw err
  }
}

async function remove(toyId: string) {
  logger.debug(`Removing toy with ID: ${toyId}`)

  try {
    const collection = await dbService.getCollection<Toy>(toysCollectionName)
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    logger.error(`Cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy: Partial<Toy>) {
  logger.debug('Adding new toy:', toy)

  try {
    const collection = await dbService.getCollection<Toy>(toysCollectionName)
    await collection.insertOne(toy as Toy)

    const toyId = new ObjectId(toy._id)
    toy.createdAt = toyId.getTimestamp().getTime()

    await collection.updateOne({ _id: new ObjectId(toyId) }, { $set: toy })
    return toy
  } catch (err) {
    logger.error('cannot insert toy', err)
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

    const collection = await dbService.getCollection<Toy>(toysCollectionName)
    await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
    return toy
  } catch (err) {
    logger.error(`Cannot update toy ${toy._id}`, err)
    throw err
  }
}

////////////////////////////////////////////////////

// ! Private Methods

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

// function _filterToys(toys: Toy[], filterBy: ToyFilterBy) {
//   logger.debug('Filtering toys from BACKEND:', filterBy)
//   const { name, inStock, maxPrice, labels } = filterBy
//   let toysToReturn = toys.slice()

//   if (name) {
//     const regExp = new RegExp(name, 'i')
//     toysToReturn = toysToReturn.filter(t => regExp.test(t.name))
//   }

//   if (inStock !== null) {
//     toysToReturn = toysToReturn.filter(t => t.inStock === inStock)
//   }

//   if (maxPrice) {
//     toysToReturn = toysToReturn.filter(t => t.price <= maxPrice)
//   }

//   if (labels.length) {
//     toysToReturn = toysToReturn.filter(t => t.labels.some(l => labels.includes(l)))
//   }

//   return toysToReturn
// }

function _sortToys(toys: Toy[], sortBy: ToySortBy) {
  logger.debug('Sorting toys from BACKEND:', sortBy)
  if (sortBy.name) {
    toys = toys.sort((t1, t2) => t1.name.localeCompare(t2.name) * sortBy.name!)
  }

  if (sortBy.price) {
    toys = toys.sort((t1, t2) => (t1.price - t2.price) * sortBy.price!)
  }

  if (sortBy.createdAt) {
    toys = toys.sort((t1, t2) => (t2.createdAt - t1.createdAt) * sortBy.createdAt!)
  }

  return toys
}
