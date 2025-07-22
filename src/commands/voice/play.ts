import path from "path";
import { Readable } from "stream";

import {
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  bold,
} from "discord.js";
import getAudioDurationInSeconds from "get-audio-duration";

import { kv } from "@/db";
import { type Song, nextIfNotPaused } from "@/voice";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("play bot sound")
  .addStringOption((option) =>
    option
      .setName("sound")
      .setDescription("name of the sound")
      .setRequired(true),
  )
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const connection = getVoiceConnection(interaction.guildId!);
  if (
    connection === undefined ||
    connection.state.status === VoiceConnectionStatus.Destroyed ||
    connection.state.status === VoiceConnectionStatus.Disconnected
  ) {
    return interaction.editReply("not in a channel");
  }
  const sound = interaction.options.get("sound")?.value as string;
  const filePath = path.join(process.cwd(), "voice", `${sound}.opus`);
  const file = Bun.file(filePath);
  if (!(await file.exists())) {
    return interaction.editReply("sound not found");
  }
  const fromDb = await kv.get(interaction.guildId!);
  const song: Song<"sound"> = {
    source: "sound",
    requester: interaction.user.id,
    data: {
      filePath,
      name: sound,
    },
  };
  if (fromDb?.playing) {
    const queue: Song[] = [...fromDb.queue, song];
    await kv.set(interaction.guildId!, { playing: song, queue });
    return interaction.editReply("added in queue");
  }
  const resource = createAudioResource<{ duration: number }>(
    Readable.from(file.stream()),
    {
      metadata: {
        duration: (await getAudioDurationInSeconds(filePath)) * 1000,
      },
    },
  );
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  player.play(resource);
  const subscription = connection.subscribe(player);
  if (subscription) {
    await kv.set(interaction.guildId!, { playing: true, queue: [] });
    setTimeout(() => {
      nextIfNotPaused(interaction.guildId!, subscription);
    }, resource.metadata.duration);
  }
  return interaction.editReply(`Playing ${bold(sound)}`);
}
