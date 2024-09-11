import _ from 'lodash'

import { toyDefs } from './typeDefs/toy.defs'
import { userDefs } from './typeDefs/user.defs'
import { authDefs } from './typeDefs/auth.defs'

import { toyResolvers } from './resolvers/toy.resolvers'
import { userResolvers } from './resolvers/user.resolvers'
import { authResolvers } from './resolvers/auth.resolvers'

const typeDefs = [toyDefs, userDefs, authDefs]
const resolvers = _.merge(toyResolvers, userResolvers, authResolvers)

export const schema = { typeDefs, resolvers }
