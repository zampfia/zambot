import { REST, Routes } from "discord.js";

import { commands } from "@/commands";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
const commandsData = Object.entries(commands).map((val) => {
  return val[1].data.toJSON();
});

if (process.argv[2] === "global") {
  await refreshGlobal();
} else {
  await refreshGuild();
}

async function refreshGlobal() {
  console.log(
    `Refreshing ${Object.keys(commands).length} slash commands GLOBALLY...`,
  );
  console.log("Stop it in the next 5 seconds if by error");

  setTimeout(async () => {
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commandsData },
    );

    // @ts-ignore data is a list, but discordjs doesn't type it
    console.log(`Refreshed ${data.length} slash commands GLOBALLY\nDONE`);
  }, 5_000);
}

async function refreshGuild() {
  console.log(
    `Refreshing ${Object.keys(commands).length} slash commands for guild id ${process.env.DISCORD_TEST_GUILD_ID}...`,
  );

  const data = await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID!,
      process.env.DISCORD_TEST_GUILD_ID!,
    ),
    { body: commandsData },
  );

  // @ts-ignore data is a list, but discordjs doesn't type it
  console.log(`Refreshed ${data.length} slash commands for guild\nDONE`);
}
