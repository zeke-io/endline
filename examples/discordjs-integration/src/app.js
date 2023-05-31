import { initialize } from './discord'

export default async function () {
  const discordBot = await initialize()

  return {
    discordBot,
  }
}
