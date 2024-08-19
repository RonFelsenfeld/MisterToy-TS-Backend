import { toyService } from '../../services/toy.service'
import { SaveToyArgs, QueryToysArgs, SingleToyArgs } from '../../data/models/resolversArgs.model'
import { Toy } from '../../data/models/toy.model'

export const toyResolvers = {
  Query: {
    toys(_: unknown, { filterBy, sortBy }: QueryToysArgs) {
      return toyService.query(filterBy, sortBy)
    },
    toy(_: unknown, args: SingleToyArgs) {
      return toyService.getById(args._id)
    },
  },

  Mutation: {
    removeToy(_: unknown, { _id }: SingleToyArgs) {
      const updatedToys = toyService.remove(_id)
      return updatedToys
    },
    addToy(_: unknown, { toy }: SaveToyArgs) {
      const newToy = toyService.add(toy)
      return newToy
    },
    updateToy(_: unknown, { toy }: SaveToyArgs) {
      const updatedToy = toyService.update(toy as Toy)
      return updatedToy
    },
  },
}
