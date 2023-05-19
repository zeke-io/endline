import { HTTPMethod } from '../http'
import { RouteHandler } from './impl'

export class RouteNode {
  public name: string
  public isParam: boolean
  public children: Map<string, RouteNode>
  public methods: { [method in HTTPMethod]?: RouteHandler }

  constructor(options?: { name: string }) {
    this.name = options?.name || ''
    this.isParam = this.name.startsWith(':')
    this.children = new Map()
    this.methods = {}
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
