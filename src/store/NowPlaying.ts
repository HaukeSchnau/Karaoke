import { Song, LyricLine } from "@src/types";
import { makeAutoObservable } from "mobx";

export default class NowPlaying {
  song: Song;
  lyrics: LyricLine[];

  volume = 0.4;
  vocalWeight = 0.75;

  isPlaying = false;
  audioPosition = 0;

  constructor(song: Song, lyrics: LyricLine[]) {
    this.song = song;
    this.lyrics = lyrics;
    makeAutoObservable(this);
  }

  get vocalVolume() {
    return this.volume * this.vocalWeight;
  }

  get currentLine() {
    const lyricIndex = this.lyrics.findIndex(
      (line) => line.startTime >= this.audioPosition
    );
    return Math.max(0, lyricIndex - 1);
  }
}
