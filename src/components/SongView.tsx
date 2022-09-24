import Loading from "@src/components/Loading";
import LyricsView from "@src/components/LyricsView";
import Seeker from "@src/components/Seeker";
import Slider from "@src/components/Slider";
import SongIcon from "@src/components/SongIcon";
import { useSongData } from "@src/hooks/useSongData";
import { trpc } from "@src/utils/trpc";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PlaylistPreview from "./PlaylistPreview";

const SongView: React.FC<{
  hasInteracted: boolean;
  songId: string;
  nextTracks?: SpotifyApi.PlaylistTrackObject[];
}> = ({ hasInteracted, songId, nextTracks }) => {
  const song = useSongData(songId);
  const remove = trpc.proxy.removeTrack.useMutation();
  const router = useRouter();

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
  }, [songId, !!song]);

  const changeTrack = async (track: SpotifyApi.TrackObjectFull) => {
    const uri = song?.songData.uri;
    if (uri) {
      // remove.mutateAsync({ uri: uri });
    }

    router.replace(`/playlist/${track.id}`);
  };

  if (!song)
    return (
      <div className="grid h-full place-items-center">
        <Loading color="#fff" />
      </div>
    );

  console.log(song.isReady, song.isPlaying);
  return (
    <div className="m-auto mt-4 flex h-full w-full flex-col px-20 text-white">
      <div className="mb-4 flex gap-4">
        <Link href="/">
          <a className="btn">Suche</a>
        </Link>
        <Link href="/playlist">
          <a className="btn">Playlist</a>
        </Link>
      </div>
      <div className="flex grow items-stretch gap-40">
        <div className="basis-1/6">
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

        <div className="h-full basis-3/6 overflow-hidden text-4xl">
          {song.isReady || song.isPlaying ? (
            <LyricsView song={song} />
          ) : (
            <div className="grid h-full place-items-center">
              <Loading color="#fff" />
            </div>
          )}
        </div>

        {nextTracks && (
          <div className="basis-2/6">
            <PlaylistPreview
              nextTracks={nextTracks}
              changeTrack={changeTrack}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(SongView);
