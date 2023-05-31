import { IncomingMessage, ServerResponse } from 'http'

export type HandlerContext = {
  req: IncomingMessage
  res: ServerResponse
  params: Record<string, string>
  body: unknown
} & Record<string, unknown>

export type RouteHandler = (
  context: HandlerContext,
) => Promise<unknown> | unknown
