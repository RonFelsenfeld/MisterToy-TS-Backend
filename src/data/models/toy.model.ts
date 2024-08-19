export interface Toy {
  _id: string
  name: string
  price: number
  labels: string[]
  createdAt: number
  inStock: boolean
}

export interface SingleToyArgs {
  _id: string
}

export interface NewToyArgs {
  toy: Partial<Toy>
}

export interface UpdateToyArgs {
  _id: string
  updates: Partial<Toy>
}
