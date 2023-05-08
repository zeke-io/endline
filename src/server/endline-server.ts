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
  private readonly projectDir: string
  private config: EndlineConfig
  private router: AppRouter
  private isDev?: boolean

  constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = isDev
    this.router = new AppRouter()
  }

  public async initialize() {
    await this.loadRoutes()
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.router.run(req, res)
    }
  }

  async loadRoutes(cleanRouter = false) {
    if (cleanRouter) {
      this.router = new AppRouter()
    }

    await loadApiRoutes(
      this.projectDir,
      this.router,
      this.config.router,
      this.isDev,
    )
  }
}
