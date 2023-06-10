import { Router, HandlerContext } from 'endline'

export default function (router: Router) {
  router.GET('/ping', () => {
    return 'Pong!'
  })

  router.GET('/greeting', ({ params }: HandlerContext) => {
    const { name } = params

    return {
      message: `Hello, ${name || 'World'}!`,
    }
  })
}
