import { buildFileName } from "@src/utils/buildFileName";
import { trpc } from "@src/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { useSongData } from "./useSongData";

const useAudio = (url?: string) => {
  const audioRef = useRef(typeof window !== "undefined" ? new Audio() : null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      if (audioRef.current && url) {
        const audioData = await fetch(url).then((res) => res.blob());
        const audioDataUrl = URL.createObjectURL(audioData);
        audioRef.current.src = audioDataUrl;
        audioRef.current.load();
        setIsLoaded(true);
      }
    })();
  }, [url]);

  return { audioRef, isLoaded };
};

export const useSong = (
  songId: string,
  options?: { hasInteracted: boolean }
) => {
  const { hasInteracted } = options ?? {};
  const timeTrackingInterval = useRef<NodeJS.Timer>();
  const preparation = trpc.proxy.prepare.useMutation();
  const nowPlaying = useSongData(songId);

  const { song } = nowPlaying ?? {};

  const fileName = song
    ? buildFileName(song.artists[0] ?? "", song.name)
    : null;
  const { audioRef: accompanimentRef, isLoaded: isLoadedAccompaniment } =
    useAudio(
      fileName ? `/api/song/${fileName}/audio/accompaniment` : undefined
    );
  const { audioRef: vocalRef, isLoaded: isLoadedVocals } = useAudio(
    fileName ? `/api/song/${fileName}/audio/vocals` : undefined
  );

  useEffect(() => {
    if (
      nowPlaying &&
      isLoadedAccompaniment &&
      isLoadedVocals &&
      hasInteracted
    ) {
      accompanimentRef.current?.play();
      vocalRef.current?.play();
      nowPlaying.isPlaying = true;
    }

    return () => {
      accompanimentRef.current?.pause();
      vocalRef.current?.pause();
      if (nowPlaying) nowPlaying.isPlaying = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadedAccompaniment, isLoadedVocals, hasInteracted, nowPlaying]);

  useEffect(() => {
    (async () => {
      if (!nowPlaying || !vocalRef.current || !accompanimentRef.current) return;

      const { song } = nowPlaying;

      await preparation.mutateAsync({
        title: song.name,
        artist: song.artists[0] ?? "",
      });

      timeTrackingInterval.current = setInterval(() => {
        if (!vocalRef.current || !accompanimentRef.current) return;
        const seconds = accompanimentRef.current.currentTime;
        nowPlaying.audioPosition = seconds * 1000;
      }, 100);

      vocalRef.current.volume = nowPlaying.vocalVolume;
      accompanimentRef.current.volume = nowPlaying.volume;
    })();

    return () => {
      clearInterval(timeTrackingInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!nowPlaying]);

  const setWeight = (weight: number) => {
    if (nowPlaying) {
      nowPlaying.vocalWeight = weight;
      if (vocalRef.current) vocalRef.current.volume = nowPlaying.vocalVolume;
    }
  };

  const setVolume = (volume: number) => {
    if (nowPlaying) {
      nowPlaying.volume = volume;
      if (accompanimentRef.current)
        accompanimentRef.current.volume = nowPlaying.volume;
      if (vocalRef.current) vocalRef.current.volume = nowPlaying.vocalVolume;
    }
  };

  const setPlaybackPos = (pos: number) => {
    if (nowPlaying) {
      nowPlaying.audioPosition = pos;
    }

    if (vocalRef.current) vocalRef.current.currentTime = pos / 1000;
    if (accompanimentRef.current)
      accompanimentRef.current.currentTime = pos / 1000;
  };

  return {
    nowPlaying,
    setWeight,
    setVolume,
    setPlaybackPos,
    vocalRef,
    accompanimentRef,
  };
};
