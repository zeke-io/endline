import { IncomingMessage } from 'http'
import getRawBody from 'raw-body'

export async function parseBody(req: IncomingMessage) {
  const contentType = req.headers['content-type'] || 'text/plain'

  const buffer = await getRawBody(req, { encoding: 'utf-8' })
  const body = buffer.toString()

  if (contentType === 'application/json') {
    return JSON.parse(body)
  } else {
    return body
  }
}
