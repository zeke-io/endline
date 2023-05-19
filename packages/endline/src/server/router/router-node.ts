import { HTTPMethod } from '../http'
import { RouteHandler } from './impl'

type Handlers = { [method in HTTPMethod]?: RouteHandler }

export class RouteNode {
  public name: string
  public isParam: boolean
  public children: Map<string, RouteNode>
  public methods: Handlers

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
    /** Return false if the {@link handler} is already registered */
    if (this.getHandler(method) != null) {
      return false
    }

    this.methods[method] = handler
    return true
  }
}
