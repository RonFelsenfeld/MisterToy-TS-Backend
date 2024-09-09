import _ from 'lodash'

import { toyDefs } from './typeDefs/toy.defs'
import { userDefs } from './typeDefs/user.defs'

import { toyResolvers } from './resolvers/toy.resolvers'
import { userResolvers } from './resolvers/user.resolvers'

const typeDefs = [toyDefs, userDefs]
const resolvers = _.merge(toyResolvers, userResolvers)

export const schema = { typeDefs, resolvers }
