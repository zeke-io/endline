import { AppRouter } from './router'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { loadApiRoutes } from './router/router-loader'
import { EndlineConfig } from './config'

interface EndlineServerOptions {
  config: EndlineConfig
  httpServer?: Server
  projectDir: string
  hostname?: string
  port?: number
  isDev?: boolean
}

export class EndlineServer {
  private readonly router: AppRouter
  private readonly projectDir: string
  private config: EndlineConfig
  private isDev?: boolean

  constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = isDev
    this.router = new AppRouter()
  }

  public async initialize() {
    await loadApiRoutes(this.projectDir, this.router, this.config.router)
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.router.run(req, res)
    }
  }
}
