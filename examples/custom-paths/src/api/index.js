async function IndexRoute(router) {
  router.GET('/', async ({ res }) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        message:
          'This route is found in the "src/api" directory instead of the default "src/routes".',
      }),
    )
  })
}

module.exports = IndexRoute
