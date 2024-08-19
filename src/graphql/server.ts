import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schema'

const server = new ApolloServer(schema)

initServer()
async function initServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })
  console.log('Server ready at:', url)
}
