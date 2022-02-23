import React from "react";
import { Link } from "react-router-dom";
import { Song } from "../types";
import "./Suggestion.css";

interface SuggestionProps {
  song: Song;
}

const Suggestion: React.FC<SuggestionProps> = ({ song }) => {
  const img = song.images.sort((a, b) => b.width - a.width)[0];

  return (
    <li className="preview-song">
      <Link to={`/song/${song.id}`}>
        <img src={img.url} />
        <div className="title">{song.name}</div>
        <div className="artist">{song.artists[0]}</div>
      </Link>
    </li>
  );
};

export default Suggestion;
