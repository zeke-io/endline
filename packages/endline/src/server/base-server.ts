import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineRequiredConfig } from '../config'

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

  protected constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = !!isDev
  }

  public abstract initialize(): void

  public abstract getRequestHandler(): RequestListener
}
