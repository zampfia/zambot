import chalk from "chalk";
import { Client, Events, GatewayIntentBits } from "discord.js";

import { logger } from "./logger";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
  logger.info(`Logged in as ${chalk.cyanBright(client.user.tag)}`);
});

client.login(process.env.DISCORD_TOKEN);
