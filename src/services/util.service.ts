import { GraphQLError } from 'graphql'
import fs from 'fs'
import { logger } from './logger.service'

export const utilService = {
  makeId,
  readJsonFile,
  handleError,
}

function makeId(length: number = 6) {
  let txt = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

function readJsonFile(path: string) {
  const str = fs.readFileSync(path, 'utf8')
  const json = JSON.parse(str)
  return json
}

function handleError(msg: string, err: string): never {
  const errMsg = `${msg}: ${err}`
  logger.error(errMsg)
  throw new GraphQLError(errMsg)
}
