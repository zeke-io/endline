import { IncomingMessage, ServerResponse } from 'http'
import {
  EndlineServer,
  RequestListener,
  EndlineServerOptions,
} from './base-server'
import { AppRouter } from './router'
import { loadApiRoutes } from './router/router-loader'
import { findAppFile } from '../lib/project-files-resolver'
import { error, warn } from '../lib/logger'

export class DevServer extends EndlineServer {
  private router: AppRouter
  private additionalContextItems?: Record<string, unknown>

  constructor(options: EndlineServerOptions) {
    super(options)

    this.router = new AppRouter()
  }

  public async initialize() {
    await this.initializeMainFile()
    await this.loadRoutes(true)
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

  private async initializeMainFile() {
    const filePath = findAppFile(this.projectDir, this.config.distDir)

    // Clear the additional context items if the app file is not valid
    if (filePath == null) {
      this.additionalContextItems = {}
      return
    }

    const file = require(filePath)
    delete require.cache[filePath]
    const module = file.default || file

    if (!module || typeof module !== 'function') {
      warn(`The main file does not export a default function, ignoring...`)
      return
    }

    const additionalContextItems = (await module()) || {}

    // It is only valid if the returned object type is null, undefined or a 'Record<string, unknown>' object
    if (
      additionalContextItems != null &&
      typeof additionalContextItems !== 'object'
    ) {
      warn(
        `The main function is returning a value of type "${typeof additionalContextItems}" when it should return an object, undefined or null.`,
      )
      return
    }

    this.additionalContextItems = additionalContextItems
  }

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
}
