import { db } from '../data/demo-data'
import { Toy, ToyFilterBy, ToySortBy } from '../data/models/toy.model'
import { logger } from './logger.service'
import { utilService } from './util.service'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
}

function query(filterBy: ToyFilterBy, sortBy: ToySortBy) {
  logger.debug('Querying toys')
  let toys = db.toys.slice()

  toys = _filterToys(toys, filterBy)
  toys = _sortToys(toys, sortBy)

  return toys
}

function getById(toyId: string) {
  logger.debug('Fetching toy with ID:', toyId)
  const toy = db.toys.find(t => t._id === toyId)

  if (!toy) {
    logger.warn('Toy not found')
    throw new Error('Toy not found')
  }

  return toy
}

function remove(toyId: string) {
  logger.debug('Removing toy with ID:', toyId)
  const toyIdx = db.toys.findIndex(t => t._id === toyId)

  if (toyIdx < 0) {
    logger.warn('Toy not found')
    throw new Error('Toy not found')
  }

  db.toys.splice(toyIdx, 1)
  return db.toys
}

function add(toy: Partial<Toy>) {
  logger.debug('Adding new toy:', toy)

  toy._id = utilService.makeId()
  toy.createdAt = Date.now()
  db.toys.push(toy as Toy)

  return toy as Toy
}

function update(toy: Toy) {
  logger.debug('Updating toy with ID:', toy._id)
  db.toys = db.toys.map(t => (t._id === toy._id ? toy : t))
  return toy
}

////////////////////////////////////////////////////

// ! Private Methods

function _filterToys(toys: Toy[], filterBy: ToyFilterBy) {
  logger.debug('Filtering toys from BACKEND:', filterBy)
  const { name, inStock, maxPrice, labels } = filterBy
  let toysToReturn = toys.slice()

  if (name) {
    const regExp = new RegExp(name, 'i')
    toysToReturn = toysToReturn.filter(t => regExp.test(t.name))
  }

  if (inStock !== null) {
    toysToReturn = toysToReturn.filter(t => t.inStock === inStock)
  }

  if (maxPrice) {
    toysToReturn = toysToReturn.filter(t => t.price <= maxPrice)
  }

  if (labels.length) {
    toysToReturn = toysToReturn.filter(t => t.labels.some(l => labels.includes(l)))
  }

  return toysToReturn
}

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
