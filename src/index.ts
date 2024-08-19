import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const server = new ApolloServer({ typeDefs, resolvers })

initServer()
async function initServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })
  console.log('Server ready at:', url)
}
