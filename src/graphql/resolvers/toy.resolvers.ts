import { GraphQLError } from 'graphql'
import { logger } from '../../services/logger.service'
import { toyService } from '../../services/toy.service'

import { Toy, SaveToyArgs, QueryToysArgs, SingleToyArgs } from '../../models/toy.model'
import { Resolver } from '../../models/resolver.model'

const toys: Resolver<Toy[], QueryToysArgs> = async (_, { filterBy, sortBy }) => {
  try {
    const toys = await toyService.query(filterBy, sortBy)
    return toys
  } catch (err) {
    logger.error('Had issues with loading toys:', err)
    throw new GraphQLError(`Failed fetching toys: ${err}`)
  }
}

const toy: Resolver<Toy, SingleToyArgs> = async (_, { _id }) => {
  try {
    const toy = await toyService.getById(_id)
    return toy as Toy
  } catch (err) {
    logger.error('Had issues with loading toy:', err)
    throw new GraphQLError(`Failed fetching toy with ID ${_id}: ${err}`)
  }
}

const removeToy: Resolver<void, SingleToyArgs> = async (_, { _id }) => {
  try {
    await toyService.remove(_id)
  } catch (err) {
    logger.error('Had issues with removing toy:', err)
    throw new GraphQLError(`Failed removing toy with ID ${_id}: ${err}`)
  }
}

const addToy: Resolver<Toy, SaveToyArgs> = async (_, { toy }) => {
  try {
    const newToy = await toyService.add(toy)
    return newToy
  } catch (err) {
    logger.error('Had issues with adding toy:', err)
    throw new GraphQLError(`Failed adding toy: ${err}`)
  }
}

const updateToy: Resolver<Toy, SaveToyArgs> = async (_, { toy }) => {
  try {
    const updatedToy = await toyService.update(toy as Toy)
    return updatedToy
  } catch (err) {
    logger.error('Had issues with updating toy:', err)
    throw new GraphQLError(`Failed updating toy: ${err}`)
  }
}

export const toyResolvers = {
  Query: {
    toys,
    toy,
  },

  Mutation: {
    removeToy,
    addToy,
    updateToy,
  },
}
