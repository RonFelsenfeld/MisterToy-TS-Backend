import { logger } from '../../services/logger.service'
import { toyService } from '../../services/toy.service'

import { Toy, SaveToyArgs, QueryToysArgs, SingleToyArgs } from '../../models/toy.model'

export const toyResolvers = {
  Query: {
    async toys(_: unknown, { filterBy, sortBy }: QueryToysArgs) {
      try {
        const toys = await toyService.query(filterBy, sortBy)
        return toys
      } catch (err) {
        console.log('Had issues with loading toys:', err)
        logger.error(err)
      }
    },
    async toy(_: unknown, args: SingleToyArgs) {
      try {
        const toy = await toyService.getById(args._id)
        return toy
      } catch (err) {
        console.log('Had issues with loading toy:', err)
        logger.error(err)
      }
    },
  },

  Mutation: {
    async removeToy(_: unknown, { _id }: SingleToyArgs) {
      try {
        await toyService.remove(_id)
      } catch (err) {
        console.log('Had issues with removing toy:', err)
        logger.error(err)
      }
    },
    async addToy(_: unknown, { toy }: SaveToyArgs) {
      try {
        const newToy = await toyService.add(toy)
        return newToy
      } catch (err) {
        console.log('Had issues with adding toy:', err)
        logger.error(err)
      }
    },
    async updateToy(_: unknown, { toy }: SaveToyArgs) {
      try {
        const updatedToy = await toyService.update(toy as Toy)
        return updatedToy
      } catch (err) {
        console.log('Had issues with updating toy:', err)
        logger.error(err)
      }
    },
  },
}
