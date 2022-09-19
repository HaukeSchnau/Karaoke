import LyricsView from "@src/components/LyricsView";
import Seeker from "@src/components/Seeker";
import Slider from "@src/components/Slider";
import SongIcon from "@src/components/SongIcon";
import { useSong } from "@src/hooks/useSong";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SongView: React.FC<{ hasInteracted: boolean }> = ({ hasInteracted }) => {
  const router = useRouter();
  const { nowPlaying, setWeight, setVolume, setPlaybackPos } = useSong(
    router.query.songId as string,
    { hasInteracted }
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
            isPlaying={nowPlaying?.isPlaying}
            imgUrl={nowPlaying?.song.imgUrl}
          />
          <div className="mt-4 text-4xl font-bold">{nowPlaying?.song.name}</div>
          <div className="text-xl">{nowPlaying?.song.artists.join(", ")}</div>

          <Seeker
            duration={nowPlaying?.song.durationMs || 1}
            position={nowPlaying?.audioPosition ?? 0}
            onChangePosition={setPlaybackPos}
          />

          <Slider
            label="Lautstärke des Original-Gesangs:"
            value={nowPlaying?.vocalWeight ?? 0}
            onChange={setWeight}
          />

          <Slider
            label="Gesamt-Lautstärke:"
            value={nowPlaying?.volume ?? 0}
            onChange={setVolume}
          />
        </div>

        <div className="h-full basis-2/3 overflow-hidden text-4xl">
          {nowPlaying && <LyricsView nowPlaying={nowPlaying} />}
        </div>
      </div>
    </div>
  );
};

export default observer(SongView);
