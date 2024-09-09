import { ObjectId, Sort } from 'mongodb'

export interface Toy {
  _id: ObjectId
  name: string
  price: number
  labels: string[]
  createdAt: number
  inStock: boolean
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
