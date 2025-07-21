import chalk from "chalk";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
  console.log(
    `${chalk.greenBright("READY")} Logged in as ${chalk.cyanBright(client.user.username)}`,
  );
});
client.login(process.env.DISCORD_TOKEN);

