import { initialize } from './discord'

/**
 * This is an optional file/function; when present,
 * Endline will run this function first before mapping the routers.
 *
 * Returning is optional, but Endline will expect you to return an object,
 * the keys and values of this object will be provided to all the routers and middlewares as parameters.
 *
 * This is useful if you need to initialize other modules or processes,
 * and provide them to your routers without making new instances.
 *
 * @returns {{discordBot: Client<boolean>}}
 */
export default async function () {
  const discordBot = await initialize()

  return {
    discordBot,
  }
}
