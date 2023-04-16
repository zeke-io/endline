import { IncomingMessage, ServerResponse } from 'http'

type RouteHandler = () => Promise<object>
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class Router {
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

  protected addRoute(
    _url: string,
    _method: HTTPMethod,
    _handler: RouteHandler,
  ) {
    //
  }

  public run(_req: IncomingMessage, _res: ServerResponse) {
    //
  }
}
