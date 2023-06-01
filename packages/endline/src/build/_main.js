const http = require('http')
const endline = require('endline/dist/endline')
const hostname = 'localhost'
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
