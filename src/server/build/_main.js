const http = require('http')
const { EndlineServer } = require('endline/dist/server/endline')

const port = parseInt(process.env.PORT, 10) || 3000
const server = http.createServer(async (req, res) => {
  await requestListener(req, res)
})

let requestListener

server.listen(port, async (err) => {
  if (err) {
    console.error(`An error has occurred starting the server!`, err)
    process.exit(1)
  }

  const endline = new EndlineServer({
    httpServer: server,
    projectDir: __dirname,
    config: { router: { routesDirectory: 'routes/' } },
  })
  requestListener = endline.requestListener
  await endline.initialize()

  console.log(`Server is ready and listening on port: ${port}`)
})
