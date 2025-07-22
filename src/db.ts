import Keyv from "keyv";

type ServerConfig = {
  playing: boolean;
  queue: string[];
};

export const kv = new Keyv<ServerConfig>();
