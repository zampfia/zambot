import { REST, Routes } from "discord.js";

import { commands } from "@/commands";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
const commandsData = Object.entries(commands).map((val) => {
  return val[1].data.toJSON();
});

console.log(`Refreshing ${Object.keys(commands).length} slash commands...`);

const data = await rest.put(
  Routes.applicationGuildCommands(
    process.env.DISCORD_CLIENT_ID!,
    process.env.DISCORD_TEST_GUILD_ID!,
  ),
  { body: commandsData },
);

// @ts-ignore data is a list, but discordjs doesn't type it
console.log(`Refreshed ${data.length} slash commands\nDONE`);
