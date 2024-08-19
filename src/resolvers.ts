import { utilService } from './services/util.service'
import { NewToyArgs, SingleToyArgs, Toy, UpdateToyArgs } from './data/models/toy.model'
import { db } from './data/demo-data'

export const resolvers = {
  Query: {
    toys: () => db.toys,
    toy: (_: unknown, args: SingleToyArgs) => db.toys.find(t => t._id === args._id),
  },
  Mutation: {
    removeToy: (_: unknown, args: SingleToyArgs) => {
      db.toys = db.toys.filter(t => t._id !== args._id)
      return db.toys
    },
    addToy(_: unknown, { toy }: NewToyArgs) {
      const newToy = { ...toy, _id: utilService.makeId(), createdAt: Date.now() }
      db.toys.push(newToy as Toy)
      return newToy
    },
    updateToy: (_: unknown, { _id, updates }: UpdateToyArgs) => {
      db.toys = db.toys.map(t => {
        if (t._id === _id) return { ...t, ...updates }
        return t
      })
      return db.toys.find(t => t._id === _id)
    },
  },
}
