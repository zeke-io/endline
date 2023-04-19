async function IndexRoute(router) {
  router.GET('/', async ({ res }) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        message:
          'This route is found in the "src/routes" directory instead of the default "src/api".',
      }),
    )
  })
}

module.exports = IndexRoute
