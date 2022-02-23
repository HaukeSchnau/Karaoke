export type Image = {
  height: number;
  width: number;
  url: string;
};

export type Song = {
  album: string;
  artists: string[];
  images: Image[];
  name: string;
  releaseDate: string;
  id: string;
  durationMs: number;
};

export type LyricLine = {
  text: string;
  startTime: number;
};
