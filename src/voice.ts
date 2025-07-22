import { Readable } from "stream";

import {
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import getAudioDurationInSeconds from "get-audio-duration";

import { kv } from "./db";

export async function playNext(guildId: string) {
  const fromDb = await kv.get(guildId);
  if (fromDb?.queue.length === 0) {
    return await kv.set(guildId, { playing: false, queue: [] });
  }
  const sound = fromDb?.queue.shift()!;
  await kv.set(guildId, { playing: true, queue: fromDb?.queue });
  const file = Bun.file(sound);
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
      (await getAudioDurationInSeconds(sound)) * 1000,
    );
  }
}
