import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import * as ping from "./util/ping";
import * as testDm from "./util/test-dm";
import * as join from "./voice/join";
import * as leave from "./voice/leave";
import * as pause from "./voice/pause";
import * as play from "./voice/play";
import * as queue from "./voice/queue";

export const commands: Record<
  string,
  {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>;
  }
> = {
  ping,
  "test-dm": testDm,
  join,
  leave,
  pause,
  play,
  queue,
};
