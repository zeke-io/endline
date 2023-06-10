import { Client, Events } from 'discord.js'

let client

/** Initialize discord bot */
export async function initialize() {
  client = new Client({ intents: [] })

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })

  await client.login(process.env.DISCORD_BOT_TOKEN)

  return client
}
