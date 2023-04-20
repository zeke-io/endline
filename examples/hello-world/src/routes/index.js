const getGreeting = async ({ res, params }) => {
  const payload = {
    message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

const getFarewell = async ({ res }) => {
  const payload = {
    message: 'Goodbye, World!',
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

/**
 * @description The index router will always be mapped to the base url
 * @param router Router provided by Endline
 */
async function IndexRoute(router) {
  router.GET('/greeting', getGreeting)
  router.GET('/farewell', getFarewell)
}

module.exports = IndexRoute
