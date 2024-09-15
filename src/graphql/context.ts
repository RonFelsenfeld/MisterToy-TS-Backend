import { Request } from 'express'

export interface ServerContext {
  token?: string
}

interface ContextArgs {
  req: Request
}

export async function context({ req }: ContextArgs) {
  console.log(req)
  return { token: 'sss' }
}
