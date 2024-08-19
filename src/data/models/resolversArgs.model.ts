import { Toy, ToyFilterBy, ToySortBy } from './toy.model'

export interface SingleToyArgs {
  _id: string
}

export interface SaveToyArgs {
  toy: Partial<Toy>
}

export interface QueryToysArgs {
  filterBy: ToyFilterBy
  sortBy: ToySortBy
}
