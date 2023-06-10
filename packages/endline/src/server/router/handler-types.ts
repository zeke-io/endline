/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage, ServerResponse } from 'http'

export type EndlineResponse = {
  headers: Record<string, string>
  status: number
  body: any
}

export type HandlerContext = {
  req: IncomingMessage
  res: ServerResponse
  params: Record<string, string>
  body: any
} & Record<string, unknown>

export type RouteHandler = (
  context: HandlerContext,
) => Promise<EndlineResponse | any> | EndlineResponse | any
