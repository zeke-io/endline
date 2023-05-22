import { IncomingMessage, ServerResponse } from 'http'

export type HandlerContext = {
  req: IncomingMessage
  res: ServerResponse
  params: Record<string, string>
} & Record<string, unknown>

export type RouteHandler = (
  context: HandlerContext,
) => Promise<unknown> | unknown
