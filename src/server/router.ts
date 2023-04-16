import { IncomingMessage, ServerResponse } from 'http'

type RouteHandler = () => Promise<object>
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

class RouteNode {
  protected handler: RouteHandler
  public children: Map<string, RouteNode> = new Map()

  constructor(handler: RouteHandler) {
    this.handler = handler
  }

  getHandler(): RouteHandler {
    return this.handler
  }
}

export class Router {
  protected root: RouteNode

  constructor() {
    // TODO: Avoid passing handler to the root node
    this.root = new RouteNode(async () => ({}))
  }

  // TODO: This should only be accessible for the request listener
  // but I'm leaving it like this until I finish implementing the router.
  public async run(req: IncomingMessage, res: ServerResponse) {
    if (!req.url) {
      // TODO: Handle this better
      console.warn('req.url is undefined, aborting')
      return
    }

    const handler = this.getHandler(req.url)

    if (handler) {
      const response = await handler()

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    } else {
      res.writeHead(404).end('Not found')
    }
  }

  protected getHandler(url: string): RouteHandler | undefined {
    const urlSegments = url.split('/')
    let node = this.root

    for (const segment of urlSegments) {
      if (segment === '') continue

      const child = node.children.get(segment)
      if (child) {
        node = child
      } else {
        return undefined
      }
    }

    return node.getHandler()
  }

  protected addRoute(url: string, _method: HTTPMethod, handler: RouteHandler) {
    const urlSegments = url.split('/')
    let node = this.root

    for (const segment of urlSegments) {
      if (segment === '') continue

      const child = node.children.get(segment)
      if (!child) {
        node.children.set(segment, new RouteNode(handler))
      } else {
        node = child
      }
    }
  }

  public GET(route: string, handler: RouteHandler): void {
    this.addRoute(route, 'GET', handler)
  }

  public POST(route: string, handler: RouteHandler): void {
    this.addRoute(route, 'POST', handler)
  }

  public PUT(route: string, handler: RouteHandler): void {
    this.addRoute(route, 'PUT', handler)
  }

  public DELETE(route: string, handler: RouteHandler): void {
    this.addRoute(route, 'DELETE', handler)
  }
}
