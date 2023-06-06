const GITHUB_REPOSITORY_URL = process.env.GITHUB_REPOSITORY_URL
const NPM_PACKAGE_URL = process.env.NPM_PACKAGE_URL

/** @param {import('endline').Router} router */
export default async function IndexRoute(router) {
  router.GET('/', () => {
    return {
      repositoryUrl: GITHUB_REPOSITORY_URL,
      npmPackageUrl: NPM_PACKAGE_URL,
    }
  })
}
