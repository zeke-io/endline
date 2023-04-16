import { Router } from './router'
import { IncomingMessage, ServerResponse, Server } from 'http'

export class EndlineServer {
  private httpServer: Server
  private router: Router

  constructor(opts: { httpServer: Server }) {
    this.httpServer = opts.httpServer
    this.router = new Router()
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.router.run(req, res)
    }
  }
}
