import { makeAutoObservable } from "mobx";

const chunkDuration = 10;

export default class AudioTrack {
  audioQueue: AudioBufferSourceNode[] = [];
  currentSource: AudioBufferSourceNode | null = null;

  context = typeof window !== "undefined" ? new AudioContext() : null!;

  gain: GainNode;

  startTime = 0;

  isDone = false;

  constructor(
    private fileName: string,
    private variant: "accompaniment" | "vocals",
    initialVolume: number
  ) {
    this.gain = this.context.createGain();
    this.gain.connect(this.context.destination);
    this.volume = initialVolume;

    makeAutoObservable(this);
  }

  get isReady() {
    return this.audioQueue.length > 0;
  }

  play() {
    if (!this.audioQueue.length) return;

    if (!this.currentSource) {
      this.startTime = this.context.currentTime;
    }

    const source = this.audioQueue.shift();

    if (!source) return;

    source.connect(this.gain);
    source.start();

    source.onended = () => {
      if (this.audioQueue.length) {
        this.play();
      } else {
        this.currentSource = null;
        this.isDone = true;
      }
    };

    this.currentSource = source;
  }

  queueData(offset = 0) {
    fetch(
      `http://localhost:5000/${this.fileName}/${offset}/${chunkDuration}/${this.variant}`
    )
      .then((res) => res.json())
      .then((data: number[][]) => {
        if (data.length === 0) {
          return;
        }
        const buffer = this.context.createBuffer(2, data.length, 48000);
        buffer.copyToChannel(new Float32Array(data.map((d) => d[0] ?? 0)), 0);
        buffer.copyToChannel(new Float32Array(data.map((d) => d[1] ?? 0)), 1);

        const source = this.context.createBufferSource();
        source.buffer = buffer;

        this.audioQueue.push(source);

        this.queueData(offset + chunkDuration);
      });
  }

  set volume(volume: number) {
    this.gain.gain.value = volume;
  }

  get currentTime() {
    return this.context.currentTime - this.startTime;
  }

  cleanUp() {
    this.currentSource?.stop();

    if (this.currentSource) this.currentSource.disconnect();

    this.audioQueue.forEach((source) => source.disconnect());
    this.audioQueue = [];

    this.context.close();

    this.context = new AudioContext();
    this.gain = this.context.createGain();
    this.gain.gain.value = 1;
    this.gain.connect(this.context.destination);
  }
}
