import { Router } from 'endline'

export default function (router: Router) {
  router.GET('/ping', () => {
    return 'Pong!'
  })

  router.GET('/hello', ({ params }: any) => {
    return {
      message: `Hello${params.name ? ` ${params.name}` : ', World!'}`,
    }
  })
}
