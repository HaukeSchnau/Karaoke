import Loading from "@src/components/Loading";
import { getImgUrl } from "@src/utils/spotify";
import { trpc } from "@src/utils/trpc";
import type { NextPage } from "next";
import Link from "next/link";
import { CSSProperties, useMemo } from "react";

const randomUnitVector = () => {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  const length = Math.sqrt(x * x + y * y);
  return { x: x / length, y: y / length };
};

const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const Playlist: NextPage = () => {
  const { data: playlist } = trpc.proxy.playlist.useQuery();

  const getRandomTrack = () => {
    if (!playlist) return null;
    const track =
      playlist.tracks.items[
        Math.floor(Math.random() * playlist.tracks.items.length)
      ];
    return track;
  };

  const tracks = useMemo(() => {
    return (
      playlist?.tracks.items.map((track) => {
        const dir = randomUnitVector();
        const r = randomNumber(0.6, 1);
        return {
          img: getImgUrl(track.track?.album.images ?? []),
          id: track.track?.id,
          name: track.track?.name,
          x: dir.x * r,
          y: dir.y * r,
          size: randomNumber(0.5, 2),
        };
      }) ?? []
    );
  }, [playlist]);

  if (!playlist)
    return (
      <div className="grid h-full place-items-center">
        <Loading color="#fff" />
      </div>
    );

  return (
    <div className="relative h-full">
      {tracks.map((track) => (
        <img
          key={track?.id}
          src={track.img}
          alt={track.name}
          className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform"
          style={
            {
              left: `calc(50% + ${track.x * 600}px)`,
              top: `calc(50% + ${track.y * 400}px)`,
              "--tw-scale-x": track.size,
              "--tw-scale-y": track.size,
            } as CSSProperties
          }
        />
      ))}
      <Link href={`/playlist/${getRandomTrack()?.track?.id}`}>
        <a className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white py-8 px-16 text-4xl font-bold transition-all hover:scale-110 hover:shadow-2xl">
          Spielen!
        </a>
      </Link>
    </div>
  );
};

export default Playlist;
