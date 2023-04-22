import { AppRouter } from './router'
import { IncomingMessage, ServerResponse } from 'http'
import { loadApiRoutes } from './router/router-loader'
import { EndlineConfig } from './config'

export class EndlineServer {
  private readonly router: AppRouter
  private readonly projectDir: string
  private config: EndlineConfig

  constructor(opts: { projectDir: string; config: EndlineConfig }) {
    this.projectDir = opts.projectDir
    this.config = opts.config
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
