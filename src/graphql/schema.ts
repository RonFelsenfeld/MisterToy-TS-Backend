import _ from 'lodash'
import { toyDefs } from './typeDefs/toy.defs'
import { toyResolvers } from './resolvers/toy.resolvers'

const typeDefs = [toyDefs]
const resolvers = _.merge(toyResolvers)

export const schema = { typeDefs, resolvers }
