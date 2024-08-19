export const toyDefs = `#graphql
type Toy{
  _id: ID,
  name: String!,
  price: Float!,
  labels: [String!]!,
  createdAt: String!,
  inStock: Boolean!
}

type Query {
  toys: [Toy]
  toy(_id: ID!): Toy
}

type Mutation {
  removeToy(_id: ID!): [Toy]
  addToy(toy: AddToyInput!): Toy
  updateToy(_id: ID!, updates: UpdateToyInput!): Toy
}

input AddToyInput {
  name: String!,
  price: Float!,
  labels: [String!]!
  inStock: Boolean!
}

input UpdateToyInput {
  name: String,
  price: Float,
  labels: [String!]
  inStock: Boolean
}
`
