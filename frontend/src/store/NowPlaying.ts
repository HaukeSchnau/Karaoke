import { makeAutoObservable } from "mobx";
import { LyricLine, Song } from "../types";

export default class NowPlaying {
  song: Song;
  lyrics: LyricLine[];

  volume = 0.4;
  vocalWeight = 0.75;

  currentLine = 0;
  isPlaying = false;
  audioPosition = 0;

  constructor(song: Song, lyrics: LyricLine[]) {
    makeAutoObservable(this);
    this.song = song;
    this.lyrics = lyrics;
  }

  get vocalVolume() {
    return this.volume * this.vocalWeight;
  }
}
