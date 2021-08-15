const { google } = require("googleapis");
import config from "./config";
import fs from "fs";
import ytdl from "ytdl-core";
import p from "path";
import { pipeline } from "stream/promises";

function checkFileExists(file: string) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function getSongData(artist: string, title: string) {
  const youtube = google.youtube("v3");
  const channelRes = await youtube.search.list({
    auth: config.googleApiKey,
    part: "snippet",
    q: artist + " Topic",
    type: "channel",
  });
  const channels = channelRes.data.items.filter((channel: any) =>
    channel.snippet.title.endsWith(" - Topic")
  );

  let songData;
  let i = 0;

  while (!songData) {
    const songRes = await youtube.search.list({
      auth: config.googleApiKey,
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

export async function downloadSong(artist: string, title: string) {
  const filename = `${artist}_${title}`
    .replace(/ /g, "_")
    .replace(/(\(|\)|\.|\:|\"|\/)/g, "");
  const path = p.join("./audio", filename);

  if (await checkFileExists(path)) {
    return filename;
  }

  const data = await getSongData(artist, title);
  const videoId = data.id.videoId;

  await pipeline(
    ytdl(videoId, { quality: "highestaudio" }),
    fs.createWriteStream(path)
  );
  return filename;
}
