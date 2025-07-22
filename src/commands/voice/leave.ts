import { getVoiceConnection } from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("leave current channel")
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  getVoiceConnection(interaction.guildId!)?.destroy();
  return interaction.editReply("left channel");
}
