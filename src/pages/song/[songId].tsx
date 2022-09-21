import Loading from "@src/components/Loading";
import LyricsView from "@src/components/LyricsView";
import Seeker from "@src/components/Seeker";
import Slider from "@src/components/Slider";
import SongIcon from "@src/components/SongIcon";
import { useSongData } from "@src/hooks/useSongData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SongView: React.FC<{ hasInteracted: boolean }> = ({ hasInteracted }) => {
  const router = useRouter();
  const song = useSongData(router.query.songId as string);

  useEffect(() => {
    if (hasInteracted && song?.isReady) {
      song?.play();
    }
  }, [hasInteracted, song, song?.isReady]);

  useEffect(() => {
    return () => {
      if (!song?.isPlaying) song?.cleanUp();
    };
  }, [!!song, song?.isPlaying]);

  useEffect(() => {
    return () => {
      song?.cleanUp();
    };
  }, [router.query.songId, !!song]);

  if (!song)
    return (
      <div className="grid h-full place-items-center">
        <Loading color="#fff" />
      </div>
    );

  return (
    <div className="m-auto flex h-full w-full flex-col px-20 text-white">
      <Link href="/">
        <a>
          <img className="mb-4 h-10" src="/img/arrow_back.svg" alt="Back" />
        </a>
      </Link>
      <div className="flex grow items-stretch gap-40">
        <div className="basis-1/3">
          <SongIcon
            isPlaying={song?.isPlaying}
            imgUrl={song?.songData.imgUrl}
          />
          <div className="mt-4 text-4xl font-bold">{song?.songData.name}</div>
          <div className="text-xl">{song?.songData.artists.join(", ")}</div>

          <Seeker
            duration={song?.songData.durationMs || 1}
            position={song?.audioPosition ?? 0}
            onChangePosition={(newPos) => (song.audioPosition = newPos)}
          />

          <Slider
            label="Lautstärke des Original-Gesangs:"
            value={song?.vocalWeight ?? 0}
            onChange={(newWeight) => (song.vocalWeight = newWeight)}
          />

          <Slider
            label="Gesamt-Lautstärke:"
            value={song?.volume ?? 0}
            onChange={(newVolume) => (song.volume = newVolume)}
          />
        </div>

        <div className="h-full basis-2/3 overflow-hidden text-4xl">
          {song.isReady || song.isPlaying ? (
            <LyricsView song={song} />
          ) : (
            <div className="grid h-full place-items-center">
              <Loading color="#fff" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(SongView);
