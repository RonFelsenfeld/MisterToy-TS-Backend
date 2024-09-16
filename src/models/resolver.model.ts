import { GraphQLResolveInfo } from 'graphql'
import { ServerContext } from '../graphql/context'

export interface Resolver<ReturnType, ArgsType = null> {
  (
    parent: unknown,
    args: ArgsType,
    context: ServerContext,
    info: GraphQLResolveInfo
  ): Promise<ReturnType>
}

export interface AuthMiddleware<T, U> {
  (resolver: Resolver<T, U>): Resolver<T, U>
}
