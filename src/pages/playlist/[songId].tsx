import SongView from "@src/components/SongView";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const PlaylistSongPage: NextPage<{ hasInteracted: boolean }> = ({
  hasInteracted,
}) => {
  const router = useRouter();

  return (
    <SongView
      hasInteracted={hasInteracted}
      songId={router.query.songId as string}
    />
  );
};

export default PlaylistSongPage;
