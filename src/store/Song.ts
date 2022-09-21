import { SongData, LyricLine } from "@src/types";
import { buildFileName } from "@src/utils/buildFileName";
import { makeAutoObservable } from "mobx";
import AudioTrack from "./AudioTrack";

export default class Song {
  songData: SongData;
  lyrics: LyricLine[];

  private m_volume = 0.4;
  private m_vocalWeight = 0.75;

  isPlaying = false;
  audioPosition = 0;

  accompaniment: AudioTrack;
  vocals: AudioTrack;

  timeTrackingInterval: NodeJS.Timeout | null = null;

  constructor(songData: SongData, lyrics: LyricLine[]) {
    this.songData = songData;
    this.lyrics = lyrics;

    const fileName = buildFileName(songData.artists[0] ?? "", songData.name);
    this.accompaniment = new AudioTrack(fileName, "accompaniment", this.volume);
    this.vocals = new AudioTrack(
      fileName,
      "vocals",
      this.volume * this.vocalWeight
    );

    makeAutoObservable(this);
  }

  get volume() {
    return this.m_volume;
  }

  set volume(value: number) {
    this.m_volume = value;
    this.accompaniment.volume = value;
    this.vocals.volume = value * this.vocalWeight;
  }

  get vocalWeight() {
    return this.m_vocalWeight;
  }

  set vocalWeight(value: number) {
    this.m_vocalWeight = value;
    this.vocals.volume = this.volume * value;
  }

  get currentLine() {
    const lyricIndex = this.lyrics.findIndex(
      (line) => line.startTime >= this.audioPosition
    );
    return Math.max(0, lyricIndex - 1);
  }

  get isReady() {
    return this.accompaniment.isReady && this.vocals.isReady;
  }

  play() {
    if (!this.isReady || this.isPlaying) return;

    this.timeTrackingInterval = setInterval(() => {
      this.audioPosition = this.accompaniment.currentTime * 1000;
    }, 100);

    this.isPlaying = true;
    this.accompaniment.play();
    this.vocals.play();
  }

  cleanUp() {
    if (this.timeTrackingInterval) clearInterval(this.timeTrackingInterval);

    this.isPlaying = false;
    this.audioPosition = 0;
    this.accompaniment.cleanUp();
    this.vocals.cleanUp();
  }

  prepare() {
    this.accompaniment.queueData();
    this.vocals.queueData();
  }
}
