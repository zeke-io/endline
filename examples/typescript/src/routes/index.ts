import { Router } from 'endline'

export default function (router: Router) {
  router.GET('/ping', () => {
    return 'Pong!'
  })
}
