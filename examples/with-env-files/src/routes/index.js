const GITHUB_REPOSITORY_URL = process.env.GITHUB_REPOSITORY_URL
const NPM_PACKAGE_URL = process.env.NPM_PACKAGE_URL

export default async function IndexRoute(router) {
  router.GET('/', async ({ res }) => {
    const payload = {
      repositoryUrl: GITHUB_REPOSITORY_URL,
      npmPackageUrl: NPM_PACKAGE_URL,
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(payload))
  })
}
