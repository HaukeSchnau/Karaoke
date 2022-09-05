import NowPlaying from "@src/store/NowPlaying";
import { trpc } from "@src/utils/trpc";
import { useEffect, useState } from "react";

export const useSongData = (songId: string) => {
  const { data: song } = trpc.proxy.spotifySongData.useQuery({
    spotifyId: songId,
  });
  const { data: lyrics } = trpc.proxy.lyrics.useQuery(
    song
      ? {
          ...song,
          artist: song?.artists[0] ?? "",
          title: song?.name ?? "",
        }
      : undefined
  );
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  useEffect(() => {
    if (song && lyrics) {
      setNowPlaying(new NowPlaying(song, lyrics));
    }
  }, [lyrics, song]);
  return nowPlaying;
};
