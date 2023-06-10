export default function (router) {
  router.GET('/ping', getPing)
}

/**
 * @param {import('discord.js').Client} discordBot
 */
async function getPing({ discordBot }) {
  const { user, ws } = discordBot

  return {
    ping: `${ws.ping}ms`,
    username: user?.username,
    discriminator: user?.discriminator,
  }
}
