import { toyService } from '../../services/toy.service'
import { NewToyArgs, SingleToyArgs, UpdateToyArgs } from '../../data/models/toy.model'

export const toyResolvers = {
  Query: {
    toys: () => toyService.query(),
    toy: (_: unknown, args: SingleToyArgs) => toyService.getById(args._id),
  },
  Mutation: {
    removeToy: (_: unknown, args: SingleToyArgs) => {
      const updatedToys = toyService.remove(args._id)
      return updatedToys
    },
    addToy(_: unknown, { toy }: NewToyArgs) {
      const newToy = toyService.add(toy)
      return newToy
    },
    updateToy: (_: unknown, { _id, updates }: UpdateToyArgs) => {
      const updatedToy = toyService.update(_id, updates)
      return updatedToy
    },
  },
}
