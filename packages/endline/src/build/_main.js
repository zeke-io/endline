const http = require('http')
const endline = require('endline/dist/endline')

process.env.NODE_ENV = 'production'
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const config = {
  distDir: '.',
}

const server = http.createServer()
const app = endline({
  httpServer: server,
  projectDir: __dirname,
  port,
  hostname,
  isDev: false,
  config,
})

server.listen(port, hostname, async () => await app.initialize())
