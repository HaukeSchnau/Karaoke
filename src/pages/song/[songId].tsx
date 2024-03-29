import SongView from "@src/components/SongView";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

const SongPage: React.FC<{ hasInteracted: boolean }> = ({ hasInteracted }) => {
  const router = useRouter();

  return (
    <SongView
      hasInteracted={hasInteracted}
      songId={router.query.songId as string}
    />
  );
};

export default observer(SongPage);
