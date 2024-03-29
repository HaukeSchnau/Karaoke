export type SongData = {
  album: string;
  artists: string[];
  images: Image[];
  name: string;
  releaseDate: string;
  id: string;
  durationMs: number;
  imgUrl?: string;
  uri: string;
};

export type Image = {
  height?: number;
  width?: number;
  url: string;
};

export type LyricLine = {
  text: string;
  startTime: number;
};
