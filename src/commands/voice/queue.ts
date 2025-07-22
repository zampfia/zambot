import {
  type APIEmbedField,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  userMention,
} from "discord.js";

import { kv } from "@/db";

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("view current queue")
  .setContexts(InteractionContextType.Guild);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const server = await kv.get(interaction.guildId!);
  const queue = server?.queue!;
  const fields: APIEmbedField[] = queue.map((val, i) => {
    return {
      name: `${i + 1}. ${val.data.name}`,
      value: `requested by ${userMention(val.requester)}`,
    };
  });
  const queueEmber = new EmbedBuilder()
    .setColor(0xff331f)
    .setTitle("Queue")
    .setDescription("current queue")
    .addFields(fields);
  return interaction.editReply({
    embeds: [queueEmber],
    allowedMentions: { users: [] },
  });
}
