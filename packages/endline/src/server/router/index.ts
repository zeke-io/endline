import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import { parseUrl } from '../../lib/url-utils'
import { warn } from '../../lib/logger'
import { HTTPMethod } from '../http'
import { Router } from './impl'
import { EndlineResponse, RouteHandler } from './handler-types'
import { parseBody } from '../http/parse-body'

export { HandlerContext, RouteHandler } from './handler-types'

class RouteNode {
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

  public async run(
    req: IncomingMessage,
    res: ServerResponse,
    additionalParams: Record<string, unknown>,
  ) {
    // Ignore if req.url and req.method are undefined
    if (!req.url || !req.method) return

    const { url: reqUrl, method } = req
    const { url, parsedSearchParams } = parseUrl(reqUrl)

    const foundHandler = this.getHandler(url.pathname, method)
    if (foundHandler) {
      const { handler, params: urlParams } = foundHandler
      const params = {
        ...parsedSearchParams,
        ...urlParams,
      }

      const requestBody = await parseBody(req)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handlerRes: any = await handler({
        req,
        res,
        params,
        body: requestBody,
        ...additionalParams,
      })

      let headers: Record<string, string> = {}
      let statusCode = 200
      let responseBody: unknown = undefined

      if (handlerRes !== null) {
        responseBody = handlerRes

        if (typeof handlerRes == 'object') {
          // If the returned response type is an object and has the body property,
          // treat it as an endline response object
          if ('body' in handlerRes) {
            const endlineRes: EndlineResponse = handlerRes

            headers = {
              ...headers,
              ...endlineRes.headers,
            }
            responseBody = endlineRes.body
            statusCode = endlineRes.status || statusCode

            // Set content type header if not present
            if (!('Content-Type' in headers)) {
              if (typeof responseBody === 'object') {
                headers['Content-Type'] = 'application/json'
              } else {
                headers['Content-Type'] = 'text/plain'
              }
            }
          } else {
            // If the response does not have a body property, just use the response object as the body
            headers['Content-Type'] = 'application/json'
          }
        } else {
          headers['Content-Type'] = 'text/plain'
        }
      }

      if (headers['Content-Type'] === 'application/json') {
        responseBody = JSON.stringify(responseBody)
      }

      res.writeHead(statusCode, headers)
      res.end(responseBody)
    } else {
      res.writeHead(404).end('Not found')
    }
  }

  public getHandler(
    url: string,
    method: string,
  ):
    | { params: { [param: string]: string }; handler: RouteHandler }
    | undefined {
    const segments = url.split('/').filter((u) => u !== '')
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
    handler: RouteHandler,
  ) {
    const segments = url.split('/').filter((u) => u !== '')
    let currentNode = this.rootNode

    for (const segment of segments) {
      const child = currentNode.children.get(segment)

      if (child) {
        currentNode = child
      } else {
        /** Create node if the path does not exist */
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

export { Router }
export default Router
