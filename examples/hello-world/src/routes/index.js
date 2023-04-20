async function IndexRoute(router) {
  router.GET('/', getGreeting)
}

module.exports = IndexRoute

const getGreeting = async ({ res, params }) => {
  const payload = {
    message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}
