import Keyv from "keyv";

import type { Song } from "./voice";

type ServerConfig = {
  playing: boolean;
  queue: Song[];
};

export const kv = new Keyv<ServerConfig>();
