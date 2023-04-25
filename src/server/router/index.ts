import { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import { parseUrl } from '../../lib/url-utils'
import { warn } from '../../lib/logger'

export interface RouterConfig {
  routesDirectory?: string
}

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RouteHandlerOptions = {
  params: object
  req: IncomingMessage
  res: ServerResponse
}
type RequestHandler = (options?: RouteHandlerOptions) => Promise<any> | any

class RouteNode {
  public name: string
  public isParam: boolean
  public children: Map<string, RouteNode>
  public methods: { [method in HTTPMethod]?: RequestHandler }

  constructor(options?: { name: string }) {
    this.name = options?.name || ''
    this.isParam = this.name.startsWith(':')
    this.children = new Map()
    this.methods = {}
  }

  public getHandler(method: HTTPMethod): RequestHandler | undefined {
    return this.methods?.[method]
  }

  public addHandler(method: HTTPMethod, handler: RequestHandler): boolean {
    /** Return false if the {@link handler} is already registered */
    if (this.getHandler(method) != null) {
      return false
    }

    this.methods[method] = handler
    return true
  }

  /*
  public removeHandler(method: HTTPMethod): void {
    delete this.methods[method]
  }

  get hasMethods(): boolean {
    return !!Object.keys(this.methods).length
  }
  */
}

export class AppRouter {
  public rootNode: RouteNode

  constructor() {
    this.rootNode = new RouteNode()
  }

  public async run(req: IncomingMessage, res: ServerResponse) {
    // Ignore if req.url and req.method are undefined
    if (!req?.url || !req?.method) return
    const { url: reqUrl, method } = req
    const { url, parsedSearchParams } = parseUrl(reqUrl)

    const foundHandler = this.getHandler(url.pathname, method)
    if (foundHandler) {
      const { handler, params: urlParams } = foundHandler
      const params = {
        ...parsedSearchParams,
        ...urlParams,
      }

      const response = await handler({
        params,
        req,
        res,
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    } else {
      res.writeHead(404).end('Not found')
    }
  }

  public getHandler(
    url: string,
    method: string,
  ):
    | { params: { [param: string]: string }; handler: RequestHandler }
    | undefined {
    const segments = url.split('/').filter((u) => u != '')
    let currentNode = this.rootNode
    const params: { [param: string]: string } = {}

    for (const segment of segments) {
      const child = currentNode.children.get(segment)

      if (child) {
        currentNode = child
      } else {
        const paramChild = [...currentNode.children].find(
          ([_key, value]: [string, RouteNode]) => value.isParam,
        )
        if (paramChild) {
          const foundChild = paramChild[1]
          let childName = foundChild.name
          childName = childName.startsWith(':') ? childName.slice(1) : childName

          params[childName] = segment
          currentNode = foundChild
          continue
        }

        return undefined
      }
    }

    const handler = currentNode.getHandler(method as HTTPMethod)

    return handler
      ? {
          params,
          handler,
        }
      : undefined
  }

  public addRouteHandler(
    url: string,
    method: HTTPMethod,
    handler: RequestHandler,
  ) {
    const segments = url.split('/').filter((u) => u != '')
    let currentNode = this.rootNode

    for (const segment of segments) {
      const child = currentNode.children.get(segment)

      if (child) {
        currentNode = child
      } else {
        /** Create node if path does not exist */
        const node = new RouteNode({
          name: segment,
        })
        currentNode.children.set(segment, node)
        currentNode = node
      }
    }

    if (currentNode.getHandler(method)) {
      warn(
        `Attempted to register an existing route '${url}' with same method '${method}'.`,
      )
      return
    } else {
      currentNode.addHandler(method, handler)
    }
  }

  public addFromRouter(router: Router) {
    const { name, endpoints } = router

    for (const { route, method, handler } of endpoints) {
      const { url } = parseUrl(
        name === 'index' ? route : path.join(name, route),
      )
      this.addRouteHandler(url.pathname, method, handler)
    }
  }
}

export class Router {
  // TODO: Delete name after refactor
  public name = 'index'
  // TODO: Redo implementation
  public readonly endpoints: {
    route: string
    method: HTTPMethod
    handler: RequestHandler
  }[] = []

  private relativeUrl: string
  private stack: Layer[]

  constructor(relativeUrl?: string) {
    this.relativeUrl = relativeUrl || ''
    this.stack = []
  }

  public getHandler(
    method: HTTPMethod,
    route: string,
  ): RequestHandler | undefined {
    // TODO: Implement
    return undefined
  }

  public merge(router: Router) {
    // TODO: Implement
  }

  // Temporarily using `handlers[0]` until implementation of multiple handlers is done
  public GET(route: string, ...handlers: RequestHandler[]) {
    this.addHandlers('GET', route, ...handlers)
    this.addEndpoint(route, 'GET', handlers[0])
    return this
  }

  public POST(route: string, ...handlers: RequestHandler[]) {
    this.addHandlers('POST', route, ...handlers)
    this.addEndpoint(route, 'POST', handlers[0])
    return this
  }

  public PUT(route: string, ...handlers: RequestHandler[]) {
    this.addHandlers('PUT', route, ...handlers)
    this.addEndpoint(route, 'PUT', handlers[0])
    return this
  }

  public DELETE(route: string, ...handlers: RequestHandler[]) {
    this.addHandlers('DELETE', route, ...handlers)
    this.addEndpoint(route, 'DELETE', handlers[0])
    return this
  }

  private addHandlers(
    method: HTTPMethod,
    route: string,
    ...handlers: RequestHandler[]
  ) {
    //
  }

  /**
   * @deprecated This method will be deleted after the new implementation
   * @private
   */
  private addEndpoint(
    route: string,
    method: HTTPMethod,
    handler: RequestHandler,
  ) {
    this.endpoints.push({
      method,
      route,
      handler,
    })
  }
}

export class Layer {}
