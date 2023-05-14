export function parseUrl(urlString: string) {
  /**
   * TODO: Find if there is a better approach to this
   */
  const url = new URL(urlString, 'https://example.com')
  const searchParams = new URLSearchParams(url.search)
  const parsedSearchParams: Record<string, string> = {}

  for (const [key, value] of searchParams.entries()) {
    parsedSearchParams[key] = value
  }

  return {
    url,
    searchParams,
    parsedSearchParams,
  }
}
