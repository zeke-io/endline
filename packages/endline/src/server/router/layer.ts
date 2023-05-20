import {
  ParseOptions,
  pathToRegexp,
  TokensToRegexpOptions,
} from 'path-to-regexp'
import { HandlerContext, RouteHandler } from './handler-types'

export class Layer {
  private pathRegex: RegExp
  private readonly handler: RouteHandler

  constructor(path: string, handler: RouteHandler) {
    const options: TokensToRegexpOptions & ParseOptions = {
      sensitive: false,
    }
    this.pathRegex = pathToRegexp(path, [], options)
    this.handler = handler
  }

  public match(path: string): boolean {
    const foundMatch = this.pathRegex.exec(path)

    return !!foundMatch
  }

  public async handleRequest(context: HandlerContext) {
    await this.handler(context)
  }
}
