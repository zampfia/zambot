import {
  ChatInputCommandInteraction,
  DiscordAPIError,
  MessageFlags,
  SlashCommandBuilder,
  userMention,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("test-dm")
  .setDescription("Test DMS")
  .addUserOption((option) =>
    option.setName("user").setDescription("user to contact").setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const dmChannel = await interaction.options.getUser("user")!.createDM();
  try {
    await dmChannel.send("Ho fame. Dammi cibo");
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      if (e.code == "50007") {
        return interaction.editReply({
          content: `Failed to send DM to ${userMention(dmChannel.recipientId)}`,
          allowedMentions: { users: [] },
        });
      }
    }
  }
  return interaction.editReply({
    content: `Sent message to ${userMention(dmChannel.recipientId)}`,
    allowedMentions: { users: [] },
  });
}
