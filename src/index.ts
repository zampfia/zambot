import chalk from "chalk";
import { Client, Events, GatewayIntentBits } from "discord.js";

import { commands } from "./commands";
import { logger } from "./logger";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
  logger.info(`Logged in as ${chalk.cyanBright(client.user.tag)}`);
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  if (commands[commandName]) {
    commands[commandName].execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
