/** @param {import('endline').Router} router */
export default function (router) {
  router.GET('/ping', () => {
    return 'Pong!'
  })

  router.GET('/greeting', ({ params }) => {
    const { name } = params

    return {
      message: `Hello, ${name || 'World'}!`,
    }
  })
}
