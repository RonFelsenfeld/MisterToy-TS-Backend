import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginCacheControlDisabled } from '@apollo/server/plugin/disabled'
import cookieParser from 'cookie-parser'
import express from 'express'

import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'

import { logger } from './services/logger.service'
import { schema } from './graphql/schema'
import { ServerContext, context } from './graphql/context'

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

const server = new ApolloServer<ServerContext>({
  ...schema,
  plugins: [
    ApolloServerPluginCacheControlDisabled(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
})

// app.get('/**', (_, res) => {
//   res.sendFile(path.resolve('public/index.html'))
// })

initServer()
async function initServer() {
  await server.start()

  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(expressMiddleware(server, { context }))

  const port = process.env.PORT || 4000
  httpServer.listen({ port })
  logger.info(`Server ready at http://localhost:${port}`)
}
