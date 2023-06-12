const { initializeApp } = require('endline/dist/lib/initialize-app')

process.env.NODE_ENV = 'production'

let shutdownServer
let shutdownHandler = () => {
  shutdownServer()
  process.exit(0)
}

process.on('SIGTERM', () => shutdownHandler)
process.on('SIGINT', () => shutdownHandler)

const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const config = {
  distDir: '.',
}

initializeApp({
  hostname,
  port,
  config,
  projectDir: __dirname,
}).then((serverTeardown) => (shutdownServer = serverTeardown))
