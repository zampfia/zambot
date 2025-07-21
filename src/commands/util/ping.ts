import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Test command");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply({
    content: `Websocket Lag: ${interaction.client.ws.ping}ms`,
    flags: MessageFlags.Ephemeral,
  });
}
