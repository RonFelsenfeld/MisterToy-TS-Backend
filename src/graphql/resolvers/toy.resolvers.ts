import { toyService } from '../../services/toy.service'
import { utilService } from '../../services/util.service'

import { adminMiddleware } from '../../middlewares/admin.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'

import {
  Toy,
  SaveToyArgs,
  QueryToysArgs,
  SingleToyArgs,
  AddToyMsgArgs,
  ToyMsg,
  RemoveToyMsgArgs,
} from '../../models/toy.model'
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

const addToyMsg: Resolver<ToyMsg, AddToyMsgArgs> = async (_, { toyId, msg: txt }, { user }) => {
  try {
    const { _id, fullName } = user! // Resolver is protected by authMiddleware, so there is a user for sure
    const msgToSave = { txt, by: { _id, fullName } }
    const savedMsg = await toyService.addMsg(toyId, msgToSave as ToyMsg)
    return savedMsg
  } catch (err) {
    throw utilService.handleError('Failed adding msg to toy', err as string)
  }
}

const removeToyMsg: Resolver<void, RemoveToyMsgArgs> = async (_, { toyId, msgId }) => {
  try {
    await toyService.removeMsg(toyId, msgId)
  } catch (err) {
    throw utilService.handleError('Failed removing msg from toy', err as string)
  }
}

export const toyResolvers = {
  Query: {
    toys,
    toy,
  },

  Mutation: {
    removeToy: adminMiddleware(removeToy),
    addToy: adminMiddleware(addToy),
    updateToy: adminMiddleware(updateToy),
    addToyMsg: authMiddleware(addToyMsg),
    removeToyMsg: adminMiddleware(removeToyMsg),
  },
}
