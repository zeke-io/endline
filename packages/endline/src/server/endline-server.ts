import { AppRouter } from './router'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { loadApiRoutes } from './router/router-loader'
import { EndlineConfig } from '../config'
import { getMainFile } from '../lib/project-files-resolver'
import { warn } from '../lib/logger'

export type RequestListener = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void>

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
  private additionalContextItems?: Record<string, unknown>

  constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = isDev
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
    await this.router.run(req, res, this.additionalContextItems || {})
  }

  private async initializeMainFile() {
    const filePath = getMainFile(this.projectDir, false)

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

    await loadApiRoutes(this.projectDir, this.router, this.isDev)
  }
}
