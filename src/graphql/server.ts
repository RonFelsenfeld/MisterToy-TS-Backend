import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'

import { schema } from './schema'

const app = express()
const httpServer = http.createServer(app)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://localhost:8080',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

const server = new ApolloServer({
  ...schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

initServer()
async function initServer() {
  await server.start()

  app.use(bodyParser.json())
  app.use(expressMiddleware(server))

  httpServer.listen({ port: 4000 })
  console.log(`🚀 Server ready at http://localhost:4000`)
}
