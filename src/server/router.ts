import { IncomingMessage, ServerResponse } from 'http'
import path from 'path'

// TODO: Add more options, and make a custom response class
type RouteHandlerOptions = {
  res: ServerResponse
}
type RouteHandler = (options?: RouteHandlerOptions) => Promise<object>
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

class RouteNode {
  public name: string
  public children: Map<string, RouteNode>
  public methods: { [method in HTTPMethod]?: RouteHandler }

  constructor(options?: { name: string }) {
    this.name = options?.name || ''
    this.children = new Map()
    this.methods = {}
  }

  public getHandler(method: HTTPMethod): RouteHandler | undefined {
    return this.methods?.[method]
  }

  public addHandler(method: HTTPMethod, handler: RouteHandler): boolean {
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
  private name?: string

  constructor(name?: string) {
    this.name = name
    this.rootNode = new RouteNode()
  }

  public async run(req: IncomingMessage, res: ServerResponse) {
    // Ignore if req.url and req.method are undefined
    if (!req?.url || !req?.method) return
    const { url, method } = req

    const handler = this.getHandler(url, method)
    if (handler) {
      const response = await handler({
        res,
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    } else {
      res.writeHead(404).end('Not found')
    }
  }

  private getHandler(url: string, method: string): RouteHandler | undefined {
    const segments = url.split('/').filter((u) => u != '')
    let currentNode = this.rootNode

    for (const segment of segments) {
      const child = currentNode.children.get(segment)

      if (child) {
        currentNode = child
      } else {
        /* URL Parameter Support
        const paramChild = [...node.children].find(
          ([_key, value]: [string, RouteNode]) => value.isParam,
        )
        if (paramChild) {
          node = paramChild[1]
          continue
        }
        */
        return undefined
      }
    }

    return currentNode.getHandler(method as HTTPMethod)
  }

  public addRouteHandler(
    url: string,
    method: HTTPMethod,
    handler: RouteHandler,
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
      console.error(
        `Attempted to register an existing route '${url}' with same method '${method}'.`,
      )
      return
    } else {
      currentNode.addHandler(method, handler)
    }
  }

  public addFromRouter(router: Router) {
    const { endpoints } = router

    for (const { route, method, handler } of endpoints) {
      this.addRouteHandler(route, method, handler)
    }
  }
}

export class Router {
  public readonly name: string
  public readonly endpoints: {
    route: string
    method: HTTPMethod
    handler: RouteHandler
  }[]

  constructor(name: string) {
    this.name = name
    this.endpoints = []
  }

  public GET(route: string, handler: RouteHandler): void {
    this.addEndpoint(route, 'GET', handler)
  }

  public POST(route: string, handler: RouteHandler): void {
    this.addEndpoint(route, 'POST', handler)
  }

  public PUT(route: string, handler: RouteHandler): void {
    this.addEndpoint(route, 'PUT', handler)
  }

  public DELETE(route: string, handler: RouteHandler): void {
    this.addEndpoint(route, 'DELETE', handler)
  }

  private addEndpoint(
    route: string,
    method: HTTPMethod,
    handler: RouteHandler,
  ) {
    /**
     * There is most likely a better approach to combine the name and the route into a valid url
     * But for now I am using the URL class
     * TODO: Find better approach
     */
    const urlRoute = new URL(path.join(this.name, route), 'https://example.com')
      .pathname

    this.endpoints.push({
      method,
      route: urlRoute,
      handler,
    })
  }
}
