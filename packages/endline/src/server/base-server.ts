import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineRequiredConfig } from '../config'
import { error } from '../lib/logger'
import { AppRouter } from './router'
import { loadApiRoutes } from './router/router-loader'

export type RequestListener = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void>

export interface EndlineServerOptions {
  config: EndlineRequiredConfig
  httpServer?: Server
  projectDir: string
  hostname?: string
  port?: number
  isDev?: boolean
}

export abstract class EndlineServer {
  protected readonly projectDir: string
  protected config: EndlineRequiredConfig
  protected isDev: boolean
  protected router: AppRouter
  protected additionalContextItems?: Record<string, unknown>

  protected constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = !!isDev

    this.router = new AppRouter()
  }

  public abstract initialize(): void

  public abstract shutdown(): void

  async loadRoutes(cleanRouter = false) {
    if (cleanRouter) {
      this.router = new AppRouter()
    }

    await loadApiRoutes(
      this.projectDir,
      this.config.distDir,
      this.router,
      this.isDev,
    )
  }

  public getRequestHandler(): RequestListener {
    return this.handleRequest.bind(this)
  }

  public async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      await this.router.run(req, res, this.additionalContextItems || {})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error(`An error has occurred on request [${req.method} ${req.url}]:`)
      console.error(e)

      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 500, message: e.message }))
    }
  }
}
