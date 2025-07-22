import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  getVoiceConnection,
} from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("pause/resume playback")
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const connection = getVoiceConnection(interaction.guildId!);
  if (connection?.state.status === VoiceConnectionStatus.Ready) {
    const player = connection.state.subscription?.player;
    if (player?.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      return interaction.editReply("resumed");
    } else {
      player?.pause(true);
      return interaction.editReply("paused");
    }
  }
  return interaction.editReply("not playing");
}
