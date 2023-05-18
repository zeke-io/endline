import { IncomingMessage, ServerResponse } from 'http'
import { HTTPMethod, HTTPMethodsArray } from '../http'

export type HandlerContext = {
  req: IncomingMessage
  res: ServerResponse
  params: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteHandler = (context: HandlerContext) => Promise<any> | any

type RouterMethods = {
  [method in HTTPMethod]: (route: string, handler: RouteHandler) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Router extends RouterMethods {}

class Router {
  private _route: string

  private _name: string
  public readonly endpoints: {
    route: string
    method: HTTPMethod
    handler: RouteHandler
  }[]

  constructor(route?: string) {
    this._route = route || '/'

    this._name = route || 'index'
    this.endpoints = []
  }

  get route() {
    return this._route
  }

  set route(route: string) {
    this._route = route
  }

  /**
   * @deprecated in favor of route property.
   * @see {@link route}
   */
  set name(name: string) {
    this._name = name
  }

  /**
   * @deprecated in favor of route property.
   * @see {@link route}
   */
  get name() {
    return this._name
  }

  public addEndpoint(method: HTTPMethod, route: string, handler: RouteHandler) {
    this.endpoints.push({
      method,
      route,
      handler,
    })
  }
}

HTTPMethodsArray.forEach(
  (method) =>
    (Router.prototype[method as HTTPMethod] = function (
      route: string,
      handler: RouteHandler,
    ) {
      this.addEndpoint(method, route, handler)
    }),
)

export { Router }
