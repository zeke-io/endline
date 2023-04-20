async function IndexRoute(router) {
  router.GET('/', async ({ res }) => {
    const payload = {
      message: 'Hello from "src/api".',
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(payload))
  })
}

module.exports = IndexRoute
