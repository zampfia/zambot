import {
  VoiceConnectionStatus,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  GuildMember,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  channelMention,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("join")
  .setDescription("join current channel")
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const channel = (interaction.member as GuildMember).voice.channel;
  if (channel === null) {
    return interaction.editReply("user not in channel");
  }
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  connection.on(VoiceConnectionStatus.Disconnected, async (_old, _new) => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
    } catch (e) {
      connection.destroy();
    }
  });
  return interaction.editReply(`connected to ${channelMention(channel.id)}`);
}
