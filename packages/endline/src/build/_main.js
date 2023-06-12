const http = require('http')
const { initializeApp } = require('endline/dist/lib/initialize-app')

process.env.NODE_ENV = 'production'
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

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
}).then()
