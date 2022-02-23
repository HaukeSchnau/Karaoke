import React, { useEffect, useRef, useState } from "react";
import "./LyricsView.css";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import NowPlaying from "../store/NowPlaying";

type LyricsViewProps = {
  nowPlaying: NowPlaying;
};

const LyricsView: React.FC<LyricsViewProps> = ({ nowPlaying }) => {
  const currentLineElement = useRef<HTMLDivElement>(null);
  const [lyricsOffset, setLyricsOffset] = useState(0);

  useEffect(() => {
    setLyricsOffset(currentLineElement.current?.offsetTop || 0);
  }, [nowPlaying.currentLine]);

  useEffect(() => {
    return () => {
      setLyricsOffset(0);
    };
  }, []);

  useEffect(() => {
    const { lyrics, audioPosition } = nowPlaying;

    const newLyricIndex = lyrics.findIndex(
      (line) => line.startTime >= audioPosition
    );
    nowPlaying.currentLine = Math.max(0, newLyricIndex - 1);
  }, [nowPlaying.audioPosition]);

  return (
    <div
      className="lyrics"
      style={{ "--offset-top": lyricsOffset + "px" } as React.CSSProperties}
    >
      {nowPlaying.lyrics.map((line, i) => (
        <div
          key={line.startTime}
          className={classNames("lyrics-line", {
            "is-current": i === nowPlaying.currentLine,
          })}
          ref={i === nowPlaying.currentLine ? currentLineElement : null}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

export default observer(LyricsView);
