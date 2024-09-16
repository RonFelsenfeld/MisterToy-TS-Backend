"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toyDefs = void 0;
exports.toyDefs = `#graphql
type Toy {
  _id: ID!
  name: String!
  price: Float!
  labels: [String!]!
  createdAt: Float!
  inStock: Boolean!
}

type Query {
  toys(filterBy: FilterByInput, sortBy: SortByInput): [Toy]
  toy(_id: ID!): Toy
}

type Mutation {
  removeToy(_id: ID!): Boolean
  addToy(toy: AddToyInput!): Toy
  updateToy(toy: UpdateToyInput!): Toy
}

input FilterByInput {
  name: String!
  inStock: Boolean
  maxPrice: Float!
  labels: [String!]!
}

input SortByInput {
  name: Int
  price: Int
  createdAt: Int
}

input AddToyInput {
  name: String!,
  price: Float!,
  labels: [String!]!
  inStock: Boolean!
}

input UpdateToyInput {
  _id: ID!,
  name: String!,
  price: Float!,
  labels: [String!]!,
  createdAt: Float!,
  inStock: Boolean!
}
`;
