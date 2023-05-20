import { HTTPMethod } from '../http'
import { RouteHandler } from './handler-types'

type Handlers = { [method in HTTPMethod]?: RouteHandler }

export class RouteNode {
  public name: string
  public isParam: boolean
  public methods: Handlers
  /**
   * @deprecated this will be removed after the new routing implementation
   */
  public children: Map<string, RouteNode>

  constructor(name?: string, handlers?: Handlers) {
    this.name = name || ''
    this.isParam = this.name.startsWith(':')
    this.children = new Map()
    this.methods = handlers || {}
  }

  public getHandler(method: HTTPMethod): RouteHandler | undefined {
    return this.methods[method]
  }

  public addHandler(method: HTTPMethod, handler: RouteHandler): boolean {
    // Return false if the method is already registered
    if (this.getHandler(method) != null) {
      return false
    }

    this.methods[method] = handler
    return true
  }
}
