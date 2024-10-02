import { ObjectId, Sort } from 'mongodb'
import { User } from './user.model'

// TODO: Refactor interfaces

export interface Toy {
  _id: ObjectId
  name: string
  price: number
  labels: string[]
  createdAt: number
  inStock: boolean
  msgs: ToyMsg[]
}

export interface ToyMsg {
  id: string
  txt: string
  by: Pick<User, '_id' | 'fullName'>
}

export interface ToyFilterBy {
  name: string
  inStock: boolean | null
  maxPrice: number
  labels: string[]
}

export interface SingleToyArgs {
  _id: string
}

export interface SaveToyArgs {
  toy: Partial<Toy>
}

export interface QueryToysArgs {
  filterBy?: ToyFilterBy
  sortBy?: Sort
}

export interface AddToyMsgArgs {
  toyId: string
  msg: string
}

export interface RemoveToyMsgArgs {
  toyId: string
  msgId: string
}
