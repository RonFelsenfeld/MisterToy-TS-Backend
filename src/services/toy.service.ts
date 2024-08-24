import fs from 'fs'
import { logger } from './logger.service'
import { utilService } from './util.service'
import { Toy, ToyFilterBy, ToySortBy } from '../data/models/toy.model'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
}

let toys: Toy[] = utilService.readJsonFile('data/toy.json')

async function query(filterBy?: ToyFilterBy, sortBy?: ToySortBy) {
  logger.debug('Querying toys')
  let toysToReturn = toys.slice()

  if (filterBy) toysToReturn = _filterToys(toysToReturn, filterBy)
  if (sortBy) toysToReturn = _sortToys(toysToReturn, sortBy)

  return Promise.resolve(toysToReturn)
}

async function getById(toyId: string) {
  logger.debug('Fetching toy with ID:', toyId)
  const toy = toys.find(t => t._id === toyId)

  if (!toy) {
    logger.warn('Toy not found')
    throw new Error('Toy not found')
  }

  return Promise.resolve(toy)
}

async function remove(toyId: string) {
  logger.debug('Removing toy with ID:', toyId)
  const toyIdx = toys.findIndex(t => t._id === toyId)

  if (toyIdx < 0) {
    logger.warn('Toy not found')
    throw new Error('Toy not found')
  }

  toys.splice(toyIdx, 1)
  await _saveToysToFile()
}

async function add(toy: Partial<Toy>) {
  logger.debug('Adding new toy:', toy)

  toy._id = utilService.makeId()
  toy.createdAt = Date.now()

  toys.push(toy as Toy)
  await _saveToysToFile()
  return toy
}

async function update(toy: Toy) {
  logger.debug('Updating toy with ID:', toy._id)

  toys = toys.map(t => (t._id === toy._id ? toy : t))
  await _saveToysToFile()
  return toy
}

////////////////////////////////////////////////////

// ! Private Methods

function _saveToysToFile() {
  return new Promise<void>((resolve, reject) => {
    const data = JSON.stringify(toys, null, 4)
    fs.writeFile('data/toy.json', data, err => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve()
    })
  })
}

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
