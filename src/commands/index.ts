import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

import * as ping from "./util/ping";

export const commands: Record<
  string,
  {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<any>;
  }
> = { ping };
