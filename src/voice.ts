import { Readable } from "stream";

import {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import getAudioDurationInSeconds from "get-audio-duration";

import { kv } from "./db";

export type SongSource = "sound";

export type SongData = {
  sound: {
    filePath: string;
    name: string;
  };
};

export type Song<T extends SongSource = SongSource> = {
  source: T;
  requester: string;
  data: SongData[T];
};

export async function playNext(guildId: string) {
  const fromDb = await kv.get(guildId);
  if (fromDb?.queue.length === 0) {
    return await kv.set(guildId, { playing: false, queue: [] });
  }
  const sound = fromDb?.queue.shift()!;
  await kv.set(guildId, { playing: true, queue: fromDb?.queue });
  switch (sound.source) {
    case "sound":
      playSound(guildId, sound);
      break;
  }
}

async function playSound(guildId: string, sound: Song<"sound">) {
  const file = Bun.file(sound.data.filePath);
  if (!(await file.exists())) {
    return playNext(guildId);
  }
  const connection = getVoiceConnection(guildId);
  const resource = createAudioResource(Readable.from(file.stream()));
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  player.play(resource);
  const subscription = connection?.subscribe(player);
  if (subscription) {
    setTimeout(
      () => {
        subscription.unsubscribe();
        setTimeout(() => playNext(guildId), 1_500);
      },
      (await getAudioDurationInSeconds(sound.data.filePath)) * 1000,
    );
  }
}
