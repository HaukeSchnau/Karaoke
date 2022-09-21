import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type Song from "../store/Song";

type LyricsViewProps = {
  song: Song;
};

const LyricsView: React.FC<LyricsViewProps> = ({ song }) => {
  const currentLineElement = useRef<HTMLDivElement>(null);
  const [lyricsOffset, setLyricsOffset] = useState(0);

  useEffect(() => {
    setLyricsOffset(currentLineElement.current?.offsetTop || 0);
  }, [song.currentLine]);

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
      {song.lyrics.map((line, i) => (
        <div
          key={line.startTime}
          className={clsx("mb-10 leading-10 opacity-70 transition-opacity", {
            "is-current": i === song.currentLine,
          })}
          ref={i === song.currentLine ? currentLineElement : null}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

export default observer(LyricsView);
