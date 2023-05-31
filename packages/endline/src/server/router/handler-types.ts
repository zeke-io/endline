import { IncomingMessage, ServerResponse } from 'http'

export type HandlerContext = {
  req: IncomingMessage
  res: ServerResponse
  params: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
} & Record<string, unknown>

export type RouteHandler = (
  context: HandlerContext,
) => Promise<unknown> | unknown
