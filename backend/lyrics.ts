import fetch from "node-fetch";
import config from "./config";

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
    usertoken: config.musixmatchUserToken,
  });

  const finalURL = baseURL + params;

  let body = await fetch(finalURL, { headers }).then((res) => res.json());
  console.log(JSON.stringify(body));

  return body.message.body.macro_calls;
}

export async function getSyncedLyrics(info: SongInfo) {
  const body = await getLyrics(info);

  console.log(body);

  // const meta = body?.["matcher.track.get"]?.message?.body;
  // if (!meta) {
  //   return null;
  // }

  // const hasSynced = meta?.track?.has_subtitles;
  // console.log(hasSynced);

  // if (hasSynced) {
  const subtitle =
    body["track.subtitles.get"]?.message?.body?.subtitle_list?.[0]?.subtitle;
  if (!subtitle) {
    return [];
  }

  return JSON.parse(subtitle.subtitle_body).map((line: any) => ({
    text: line.text || "⋯",
    startTime: line.time.total * 1000,
  }));
  // }
}
