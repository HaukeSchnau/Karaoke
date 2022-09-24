// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require("googleapis");
import fs from "fs";
import ytdl from "ytdl-core";
import p from "path";
import { pipeline } from "stream/promises";
import { env } from "@src/env/server.mjs";
import fsExtra from "fs-extra";

function checkFileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function getSongData(artist: string, title: string) {
  const youtube = google.youtube("v3");

  const channelRes = await youtube.search.list({
    auth: env.GOOGLE_API_KEY,
    part: "snippet",
    q: artist + " Topic",
    type: "channel",
  });
  const channels = channelRes.data.items.filter((channel: any) =>
    channel.snippet.title.endsWith(" - Topic")
  );

  let songData;

  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const res = await youtube.search.list({
      auth: env.GOOGLE_API_KEY,
      part: "snippet",
      channelId: channel.snippet.channelId,
      q: title,
      type: "video",
    });

    const video = res.data.items.find(
      (vid: any) =>
        vid.snippet.title.toLowerCase().trim() === title.toLowerCase().trim()
    );

    if (video) {
      songData = video;
      break;
    }
  }

  let i = 0;
  while (!songData) {
    const songRes = await youtube.search.list({
      auth: env.GOOGLE_API_KEY,
      part: "snippet",
      q: title,
      type: "video",
      channelId: channels[i].snippet.channelId,
    });

    const songs = songRes.data.items;
    songData = songs[0];
    i++;
  }

  return songData;
}

export async function downloadSong(
  artist: string,
  title: string,
  filename: string
) {
  const dir = "./cache/audio";
  await fsExtra.ensureDir(dir);
  const path = p.join(dir, filename);

  if (await checkFileExists(path)) {
    return;
  }

  const data = await getSongData(artist, title);
  const videoId = data.id.videoId;

  await pipeline(
    ytdl(videoId, { quality: "highestaudio" }),
    fs.createWriteStream(path)
  );
}
