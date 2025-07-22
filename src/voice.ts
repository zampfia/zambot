import { Readable } from "stream";

import {
  AudioPlayerStatus,
  AudioResource,
  NoSubscriberBehavior,
  PlayerSubscription,
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

export async function nextIfNotPaused(
  guildId: string,
  subscription: PlayerSubscription,
) {
  if (subscription.player.state.status !== AudioPlayerStatus.Playing) {
    setTimeout(() => nextIfNotPaused(guildId, subscription), 1_000);
  } else {
    const resource = subscription.player.state.resource as AudioResource<{
      duration: number;
    }>;
    if (resource.playbackDuration >= resource.metadata.duration) {
      subscription.unsubscribe();
      setTimeout(() => playNext(guildId), 1_500);
    } else {
      setTimeout(() => {
        nextIfNotPaused(guildId, subscription);
      }, resource.metadata.duration - resource.playbackDuration);
    }
  }
}

async function playSound(guildId: string, sound: Song<"sound">) {
  const file = Bun.file(sound.data.filePath);
  if (!(await file.exists())) {
    return playNext(guildId);
  }
  const connection = getVoiceConnection(guildId);
  const resource = createAudioResource<{ duration: number }>(
    Readable.from(file.stream()),
    {
      metadata: {
        duration:
          (await getAudioDurationInSeconds(sound.data.filePath)) * 1_000,
      },
    },
  );
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  player.play(resource);
  const subscription = connection?.subscribe(player);
  if (subscription) {
    setTimeout(() => {
      nextIfNotPaused(guildId, subscription);
    }, resource.metadata.duration);
  }
}
