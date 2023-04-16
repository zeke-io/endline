import { Router } from './router'
import { IncomingMessage, ServerResponse, Server } from 'http'

export class EndlineServer {
  private httpServer: Server
  private router: Router
  private readonly projectDir: string

  constructor(opts: { httpServer: Server; projectDir: string }) {
    this.httpServer = opts.httpServer
    this.projectDir = opts.projectDir
    this.router = new Router()
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.router.run(req, res)
    }
  }
}
