import { env } from "@src/env/server.mjs";
import { buildFileName } from "@src/utils/buildFileName";
import fetch from "node-fetch";
import fsExtra from "fs-extra";

const headers = {
  authority: "apic-desktop.musixmatch.com",
  cookie: "x-mxm-token-guid=",
};
const baseURL = `https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?format=json&namespace=lyrics_richsynched&subtitle_format=mxm&app_id=web-desktop-app-v1.0&`;

type SongInfo = {
  album: string;
  artist: string;
  title: string;
  id: string;
};

async function getLyrics(info: SongInfo) {
  const params = new URLSearchParams({
    q_album: info.album,
    q_artist: info.artist,
    q_artists: info.artist,
    q_track: info.title,
    track_spotify_id: info.id,
    usertoken: env.MUSIXMATCH_USER_TOKEN,
  });

  const finalURL = baseURL + params;

  const body = (await fetch(finalURL, { headers }).then((res) =>
    res.json()
  )) as any;

  return body.message.body.macro_calls;
}

export async function getSyncedLyrics(info: SongInfo) {
  const fileName = buildFileName(info.artist, info.title);
  const path = `./cache/lyrics/${fileName}.json`;
  if (await fsExtra.pathExists(path)) {
    return await fsExtra.readJson(path);
  }

  const body = await getLyrics(info);
  const subtitle =
    body["track.subtitles.get"]?.message?.body?.subtitle_list?.[0]?.subtitle;
  if (!subtitle) {
    return [];
  }

  const lyrics = JSON.parse(subtitle.subtitle_body).map((line: any) => ({
    text: line.text || "⋯",
    startTime: line.time.total * 1000,
  }));

  await fsExtra.outputJson(path, lyrics, { spaces: 2 });
  return lyrics;
}
