import { AppRouter } from './router'
import { IncomingMessage, ServerResponse, Server } from 'http'
import { loadApiRoutes } from './router-loader'

export class EndlineServer {
  private httpServer: Server
  private readonly router: AppRouter
  private readonly projectDir: string

  constructor(opts: { httpServer: Server; projectDir: string }) {
    this.httpServer = opts.httpServer
    this.projectDir = opts.projectDir
    this.router = new AppRouter()
  }

  public async initialize() {
    await loadApiRoutes(this.projectDir, this.router)
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.router.run(req, res)
    }
  }
}
