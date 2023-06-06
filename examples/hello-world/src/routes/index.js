/** @param {import('endline').Router} router */
export default function (router) {
  router.GET('/', ({ params }) => {
    return {
      message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
    }
  })
}
