/** @param {import('endline').Router} router */
export default function (router) {
  router.GET('/ping', () => {
    return 'Pong!'
  })

  router.GET('/hello', ({ params }) => {
    return {
      message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
    }
  })
}
