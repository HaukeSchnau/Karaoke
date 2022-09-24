import SongView from "@src/components/SongView";
import { trpc } from "@src/utils/trpc";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

const PlaylistSongPage: NextPage<{ hasInteracted: boolean }> = ({
  hasInteracted,
}) => {
  const router = useRouter();
  const { data: playlist } = trpc.proxy.playlist.useQuery();
  const nextTracks = useMemo(() => {
    if (!playlist) return [];
    const index = playlist.tracks.items.findIndex(
      (track) => track.track?.id === router.query.songId
    );
    return playlist.tracks.items.slice(index + 1);
  }, [playlist, router.query.songId]);

  return (
    <SongView
      hasInteracted={hasInteracted}
      songId={router.query.songId as string}
      nextTracks={nextTracks}
    />
  );
};

export default PlaylistSongPage;
