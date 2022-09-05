import { Image, Song } from "@src/types";
import Link from "next/link";
import React from "react";

interface SuggestionProps {
  song: Song;
}

const Suggestion: React.FC<SuggestionProps> = ({ song }) => {
  return (
    <li className="rounded-2xl transition hover:bg-overlay-black">
      <Link href={`/song/${song.id}`}>
        <a className="flex flex-col items-center text-center">
          {song.imgUrl && <img src={song.imgUrl} className="rounded-2xl" />}
          <div className="mt-2 font-bold">{song.name}</div>
          <div className="mt-1 mb-2">{song.artists[0]}</div>
        </a>
      </Link>
    </li>
  );
};

export default Suggestion;
