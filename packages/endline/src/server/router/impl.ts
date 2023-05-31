import { HTTPMethod, HTTPMethodsArray } from '../http'
import { RouteHandler } from './handler-types'

type RouterMethods = {
  [method in HTTPMethod]: (route: string, handler: RouteHandler) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Router extends RouterMethods {}

class Router {
  private _name: string
  public readonly endpoints: {
    route: string
    method: HTTPMethod
    handler: RouteHandler
  }[]

  constructor(name?: string) {
    this._name = name || 'index'
    this.endpoints = []
  }

  set name(name: string) {
    this._name = name
  }

  get name() {
    return this._name
  }

  public addEndpoint(route: string, method: HTTPMethod, handler: RouteHandler) {
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
      this.addEndpoint(route, method, handler)
    }),
)

export { Router }
