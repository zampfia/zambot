import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import * as ping from "./util/ping";
import * as testDm from "./util/test-dm";

export const commands: Record<
  string,
  {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
  }
> = { ping, "test-dm": testDm };
