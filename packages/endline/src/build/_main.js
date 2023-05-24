const http = require('http')
const endline = require('packages/endline/dist/endline')
const hostname = 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const server = http.createServer()
const app = endline({
  httpServer: server,
  projectDir: __dirname,
  port,
  hostname,
  isDev: false,
  config: { router: { routesDirectory: 'routes/' } },
})

server.listen(port, hostname, async () => await app.initialize())
