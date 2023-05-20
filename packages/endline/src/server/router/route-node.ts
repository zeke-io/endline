import { HTTPMethod } from '../http'
import { HandlerContext, RouteHandler } from './handler-types'

type Handlers = { [method in HTTPMethod]?: RouteHandler }

export class RouteNode {
  private path: string
  private methods: Handlers

  /** @deprecated this will be removed after the new routing implementation */
  public name: string
  /** @deprecated this will be removed after the new routing implementation */
  public isParam: boolean
  /** @deprecated this will be removed after the new routing implementation */
  public children: Map<string, RouteNode>

  // TODO: Make path not optional
  constructor(path?: string, handlers?: Handlers) {
    this.path = path || '/'
    this.methods = handlers || {}

    this.name = path || ''
    this.isParam = this.name.startsWith(':')

    this.children = new Map()
  }

  /**
   * @param method The request method
   * @param handler The handler to save with the given method
   * @return {boolean} It will return true if the method was not registered already, false if otherwise
   */
  public addHandler(method: HTTPMethod, handler: RouteHandler): boolean {
    if (this.hasMethod(method)) {
      return false
    }

    this.methods[method] = handler
    return true
  }

  /**
   * Checks if there is a handler registered with the given method
   *
   * @param {HTTPMethod} method The request method
   */
  public hasMethod(method: HTTPMethod) {
    return !!this.methods[method]
  }

  /**
   * Gets the route handler registered with the given method
   *
   * @param method The request method
   * @return route handler, undefined if not found
   */
  public getHandler(method: HTTPMethod): RouteHandler | undefined {
    return this.methods[method]
  }

  /**
   * Runs the route handler with the given method and context
   *
   * @private
   * @param {HTTPMethod} method The request method
   * @param {HandlerContext} context The context of the request
   */
  public async run(method: HTTPMethod, context: HandlerContext) {
    const handler = this.getHandler(method)

    // TODO: Handle exceptions
    if (handler) {
      await handler(context)
    }
  }
}
