import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type NowPlaying from "../store/NowPlaying";

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

  return (
    <div
      className="lyrics"
      style={{ "--offset-top": lyricsOffset + "px" } as React.CSSProperties}
    >
      {nowPlaying.lyrics.map((line, i) => (
        <div
          key={line.startTime}
          className={clsx("mb-10 leading-10 opacity-70 transition-opacity", {
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
