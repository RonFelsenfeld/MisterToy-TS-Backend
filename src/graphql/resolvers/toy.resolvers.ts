import { toyService } from '../../services/toy.service'
import { utilService } from '../../services/util.service'
import { authMiddleware } from '../../middlewares/auth.middleware'

import { Toy, SaveToyArgs, QueryToysArgs, SingleToyArgs } from '../../models/toy.model'
import { Resolver } from '../../models/resolver.model'

const toys: Resolver<Toy[], QueryToysArgs> = async (_, { filterBy, sortBy }) => {
  try {
    const toys = await toyService.query(filterBy, sortBy)
    return toys
  } catch (err) {
    throw utilService.handleError('Failed fetching toys', err as string)
  }
}

const toy: Resolver<Toy, SingleToyArgs> = async (_, { _id }) => {
  try {
    const toy = await toyService.getById(_id)
    return toy as Toy
  } catch (err) {
    throw utilService.handleError(`Failed fetching toy with ID ${_id}`, err as string)
  }
}

const removeToy: Resolver<void, SingleToyArgs> = async (_, { _id }) => {
  try {
    await toyService.remove(_id)
  } catch (err) {
    throw utilService.handleError(`Failed removing toy with ID ${_id}`, err as string)
  }
}

const addToy: Resolver<Toy, SaveToyArgs> = async (_, { toy }) => {
  try {
    const newToy = await toyService.add(toy)
    return newToy
  } catch (err) {
    throw utilService.handleError('Failed adding toy', err as string)
  }
}

const updateToy: Resolver<Toy, SaveToyArgs> = async (_, { toy }) => {
  try {
    const updatedToy = await toyService.update(toy as Toy)
    return updatedToy
  } catch (err) {
    throw utilService.handleError('Failed updating toy', err as string)
  }
}

export const toyResolvers = {
  Query: {
    toys,
    toy,
  },

  Mutation: {
    removeToy: authMiddleware(removeToy),
    addToy: authMiddleware(addToy),
    updateToy: authMiddleware(updateToy),
  },
}
