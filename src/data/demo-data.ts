import { Toy } from './models/toy.model'

const toys: Toy[] = [
  {
    _id: '1',
    name: 'Lego',
    price: 19,
    labels: [],
    createdAt: Date.now(),
    inStock: true,
  },
  {
    _id: '2',
    name: 'Xbox',
    price: 12,
    labels: [],
    createdAt: Date.now(),
    inStock: false,
  },
]

export const db = { toys }
