/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Add types to router and params

export default function (router: any) {
  router.GET('/ping', () => {
    return 'Pong!'
  })

  router.GET('/hello', ({ params }: any) => {
    return {
      message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
    }
  })
}
