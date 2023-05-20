import { IncomingMessage, ServerResponse } from 'http'
import { HTTPMethod, HTTPMethodsArray } from '../http'
import { HandlerContext, RouteHandler } from './handler-types'
import { Layer } from './layer'
import { parseUrl } from '../../lib/url-utils'

type RouterMethods = {
  [method in HTTPMethod]: (route: string, handler: RouteHandler) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Router extends RouterMethods {}

class Router {
  private _route: string
  private stack: Layer[]

  private _name: string
  public readonly endpoints: {
    route: string
    method: HTTPMethod
    handler: RouteHandler
  }[]

  constructor(route = '/') {
    this._route = route
    this.stack = []

    this._name = route || 'index'
    this.endpoints = []
  }

  // TODO: Implement
  public getHandler(
    _method: HTTPMethod,
    _route: string,
  ): RouteHandler | undefined {
    return undefined
  }

  public async run(
    req: IncomingMessage,
    res: ServerResponse,
    additionalParams: Record<string, unknown>,
  ) {
    const { url, parsedSearchParams } = parseUrl(req.url!)
    let foundLayer: Layer | undefined

    for (const layer of this.stack) {
      const matches = layer.match(url.pathname)
      if (matches) {
        continue
      }

      foundLayer = layer
    }

    if (!foundLayer) {
      // No layers found with given url
      // TODO: Implement "not found" handler
      return
    }

    const context: HandlerContext = {
      req,
      res,
      params: {
        ...parsedSearchParams,
      },
      ...additionalParams,
    }
    await foundLayer.handleRequest(context)
  }

  public merge(router: Router) {
    //
  }

  public addEndpoint(method: HTTPMethod, route: string, handler: RouteHandler) {
    this.endpoints.push({
      method,
      route,
      handler,
    })
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
