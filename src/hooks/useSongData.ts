import Song from "@src/store/Song";
import { trpc } from "@src/utils/trpc";
import { useEffect, useState } from "react";

export const useSongData = (songId: string) => {
  const preparation = trpc.proxy.prepare.useMutation();
  const { data: songData } = trpc.proxy.spotifySongData.useQuery({
    spotifyId: songId,
  });
  const { data: lyrics } = trpc.proxy.lyrics.useQuery(
    songData
      ? {
          ...songData,
          artist: songData?.artists[0] ?? "",
          title: songData?.name ?? "",
        }
      : undefined
  );
  const [song, setSong] = useState<Song | null>(null);
  useEffect(() => {
    if (songData && lyrics) {
      setSong(new Song(songData, lyrics));
    }
  }, [lyrics, songData]);

  useEffect(() => {
    (async () => {
      if (!song) return;

      const { songData } = song;

      await preparation.mutateAsync({
        title: songData.name,
        artist: songData.artists[0] ?? "",
      });

      song.prepare();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!song]);

  return song;
};
