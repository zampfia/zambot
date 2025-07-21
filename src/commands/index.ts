import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import * as ping from "./util/ping";

export const commands: Record<
  string,
  {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
  }
> = { ping };
