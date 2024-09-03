import { ObjectId } from 'mongodb'

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

export interface ToySortBy {
  name?: 1 | -1
  price?: 1 | -1
  createdAt?: 1 | -1
}
