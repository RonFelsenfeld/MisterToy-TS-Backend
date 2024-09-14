import { GraphQLError } from 'graphql'
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
        logger.error('Had issues with loading toys:', err)
        throw new GraphQLError(`Failed fetching toys: ${err}`)
      }
    },

    async toy(_: unknown, { _id }: SingleToyArgs) {
      try {
        const toy = await toyService.getById(_id)
        return toy
      } catch (err) {
        logger.error('Had issues with loading toy:', err)
        throw new GraphQLError(`Failed fetching toy with ID ${_id}: ${err}`)
      }
    },
  },

  Mutation: {
    async removeToy(_: unknown, { _id }: SingleToyArgs) {
      try {
        await toyService.remove(_id)
      } catch (err) {
        logger.error('Had issues with removing toy:', err)
        throw new GraphQLError(`Failed removing toy with ID ${_id}: ${err}`)
      }
    },

    async addToy(_: unknown, { toy }: SaveToyArgs) {
      try {
        const newToy = await toyService.add(toy)
        return newToy
      } catch (err) {
        logger.error('Had issues with adding toy:', err)
        throw new GraphQLError(`Failed adding toy: ${err}`)
      }
    },

    async updateToy(_: unknown, { toy }: SaveToyArgs) {
      try {
        const updatedToy = await toyService.update(toy as Toy)
        return updatedToy
      } catch (err) {
        logger.error('Had issues with updating toy:', err)
        throw new GraphQLError(`Failed updating toy: ${err}`)
      }
    },
  },
}
