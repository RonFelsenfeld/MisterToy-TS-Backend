import { db } from '../data/demo-data'
import { Toy } from '../data/models/toy.model'
import { logger } from './logger.service'
import { utilService } from './util.service'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
}

function query() {
  logger.debug('Querying toys')
  return db.toys
}

function getById(toyId: string) {
  logger.debug('Querying toy with ID:', toyId)
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

function update(toyId: string, updates: Partial<Toy>) {
  logger.debug('Updating toy with ID:', toyId, 'updates:', updates)

  db.toys = db.toys.map(t => {
    if (t._id === toyId) return { ...t, ...updates }
    return t
  })

  return db.toys.find(t => t._id === toyId)
}
