import express from "express";
import bp from "body-parser";
import { search, getSongById } from "./spotify";
import { getSyncedLyrics } from "./lyrics";
import { downloadSong } from "./youtube";
import { seperate } from "./spleeter";
import p from "path";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/api/search", async (req, res) => {
  const query = req.query.q as string;
  const searchRes = await search(query);
  res.json(searchRes);
});

app.get("/api/spotify-songs/:id", async (req, res) => {
  const id = req.params.id;
  const song = await getSongById(id);
  res.json(song);
});

app.get("/api/lyrics/:artist/:album/:song/:id", async (req, res) => {
  const { album, artist, song: title, id } = req.params;
  const lyrics = await getSyncedLyrics({ album, artist, title, id });
  console.log(album, artist, title);
  console.log(lyrics[0]);
  res.json(lyrics);
});

app.post("/api/prepare", async (req, res) => {
  const { artist, title } = req.body;
  const fileName = await downloadSong(artist, title);
  await seperate(fileName);
  res.json({ fileName });
});

app.get("/api/audio/:fileName/vocals", async (req, res) => {
  const path = p.join(
    __dirname,
    "seperated",
    req.params.fileName,
    "vocals.wav"
  );
  res.sendFile(path);
});

app.get("/api/audio/:fileName/accompaniment", async (req, res) => {
  const path = p.join(
    __dirname,
    "seperated",
    req.params.fileName,
    "accompaniment.wav"
  );
  res.sendFile(path);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
