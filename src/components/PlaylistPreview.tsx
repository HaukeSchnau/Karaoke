import { trpc } from "@src/utils/trpc";
import React from "react";

interface PlaylistPreviewProps {
  nextTracks: SpotifyApi.PlaylistTrackObject[];
  changeTrack: (track: SpotifyApi.TrackObjectFull) => void;
}

const PlaylistPreview: React.FC<PlaylistPreviewProps> = ({
  nextTracks,
  changeTrack,
}) => {
  return (
    <div className="h-full overflow-hidden">
      <h5 className="mb-4 text-4xl italic">comin&apos; up:</h5>
      <div className="flex flex-col gap-4">
        {nextTracks.slice(0, 6).map((track) => (
          <button
            key={track.track?.id}
            className="flex h-24 gap-4 overflow-hidden rounded-2xl bg-white text-black"
            onClick={() => track.track && changeTrack(track.track)}
          >
            <img
              src={track.track?.album.images[0]?.url}
              alt={track.track?.name}
              className="w-24 rounded-2xl object-contain shadow-2xl "
            />
            <div className="flex h-full flex-col justify-between py-2 text-left">
              <div>
                <div className="text-base font-bold">{track.track?.name}</div>
                <div className="text-base">
                  {track.track?.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
              <div className="text-xs text-gray">
                Hinzugefügt von{" "}
                {track.added_by?.display_name ?? track.added_by.id}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPreview;
