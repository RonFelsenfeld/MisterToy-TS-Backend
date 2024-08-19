import { db } from '../data/demo-data'
import { Toy } from '../data/models/toy.model'
import { utilService } from './util.service'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
}

function query() {
  return db.toys
}

function getById(toyId: string) {
  const toy = db.toys.find(t => t._id === toyId)
  if (!toy) throw new Error('Toy not found')
  return toy
}

function remove(toyId: string) {
  const toyIdx = db.toys.findIndex(t => t._id === toyId)
  if (toyIdx < 0) throw new Error('Toy not found')

  db.toys.splice(toyIdx, 1)
  return db.toys
}

function add(toy: Partial<Toy>) {
  toy._id = utilService.makeId()
  toy.createdAt = Date.now()
  db.toys.push(toy as Toy)
  return toy as Toy
}

function update(toyId: string, updates: Partial<Toy>) {
  db.toys = db.toys.map(t => {
    if (t._id === toyId) return { ...t, ...updates }
    return t
  })
  return db.toys.find(t => t._id === toyId)
}
