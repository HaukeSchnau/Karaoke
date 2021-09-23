import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Seeker from "./Seeker";
import SongIcon from "./SongIcon";
import "./SongView.css";
import { Song } from "./types";

type SongViewParams = {
  id: string;
};

type LyricLine = {
  text: string;
  startTime: number;
};

function SongView() {
  const { id } = useParams<SongViewParams>();
  const history = useHistory();

  const [song, setSong] = useState<Song>();
  const [isPlaying, setPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const accompanimentRef = useRef<HTMLAudioElement>(null);
  const vocalsRef = useRef<HTMLAudioElement>(null);
  const currentLineElement = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(-1);
  const [lyricsOffset, setLyricsOffset] = useState(0);
  const [audioPositionMs, setAudioPositionMS] = useState(0);

  const [vocalWeight, setVocalWeight] = useState(0.75);
  const [volume, setVolume] = useState(0.4);

  const currentTimeoutHandle = useRef(-1);
  const tempTimeoutHandle = useRef(-1);
  const timeTrackingInterval = useRef(-1);

  function setTimeoutForNextLine(
    lyrics: LyricLine[],
    currentLineIndex: number
  ) {
    currentTimeoutHandle.current = setTimeout(
      () => {
        setCurrentLine(currentLineIndex + 1);

        setTimeoutForNextLine(lyrics, currentLineIndex + 1);
      },
      lyrics[currentLineIndex]
        ? lyrics[currentLineIndex + 1].startTime -
            lyrics[currentLineIndex].startTime -
            10
        : lyrics[currentLineIndex + 1].startTime - 10
    );
  }

  useEffect(() => {
    (async () => {
      const song = (await fetch(
        "http://localhost:3000/api/spotify-songs/" + id
      ).then((res) => res.json())) as Song;
      console.log(song);

      const imgUrl = song.images.sort((a, b) => b.width - a.width)[0]?.url;

      const { fileName } = await fetch("http://localhost:3000/api/prepare", {
        method: "POST",
        body: JSON.stringify({ title: song.name, artist: song.artists[0] }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setSong(song);

      const accompaniment = await fetch(
        "http://localhost:3000/api/audio/" + fileName + "/accompaniment"
      ).then((res) => res.blob());
      const accompanimentUrl = URL.createObjectURL(accompaniment);
      accompanimentRef.current!.src = accompanimentUrl;

      const vocals = await fetch(
        "http://localhost:3000/api/audio/" + fileName + "/vocals"
      ).then((res) => res.blob());
      const vocalsUrl = URL.createObjectURL(vocals);
      vocalsRef.current!.src = vocalsUrl;

      const newLyrics = (await fetch(
        `http://localhost:3000/api/lyrics/${encodeURIComponent(
          song.artists[0]
        )}/${encodeURIComponent(song.album)}/${encodeURIComponent(song.name)}/${
          song.id
        }`
      ).then((res) => res.json())) as LyricLine[];
      console.log(newLyrics);
      setLyrics(newLyrics);

      setTimeoutForNextLine(newLyrics, -1);

      accompanimentRef.current?.play();
      vocalsRef.current?.play();

      timeTrackingInterval.current = setInterval(() => {
        if (vocalsRef.current == null || accompanimentRef.current == null)
          return;

        // console.log(
        //   accompanimentRef.current.currentTime,
        //   vocalsRef.current.currentTime,
        //   (accompanimentRef.current.currentTime || 0) -
        //     (vocalsRef.current.currentTime || 0)
        // );
        const seconds = accompanimentRef.current.currentTime || 0;
        setAudioPositionMS(seconds * 1000);
        // vocalsRef.current.currentTime = accompanimentRef.current.currentTime;
      }, 1000);

      vocalsRef.current!.volume = vocalWeight * volume;
      accompanimentRef.current!.volume = volume;

      console.log(accompaniment);

      setPlaying(true);
    })();

    return () => {
      setSong(undefined);
      setPlaying(false);
      setLyrics([]);
      setCurrentLine(-1);
      setLyricsOffset(0);
      setAudioPositionMS(0);

      clearTimeout(currentTimeoutHandle.current);
      clearInterval(tempTimeoutHandle.current);
      clearInterval(timeTrackingInterval.current);
    };
  }, []);

  useEffect(() => {
    setLyricsOffset(currentLineElement.current?.offsetTop || 0);
  }, [currentLine]);

  function onChangeWeight(newVocalWeight: number) {
    setVocalWeight(newVocalWeight);
    vocalsRef.current!.volume = newVocalWeight * volume;
  }

  function onChangeVolume(newVolume: number) {
    setVolume(newVolume);
    accompanimentRef.current!.volume = newVolume;
    vocalsRef.current!.volume = vocalWeight * newVolume;
  }

  function onChangePlaybackPos(newPos: number) {
    clearTimeout(currentTimeoutHandle.current);
    clearInterval(tempTimeoutHandle.current);

    setAudioPositionMS(newPos);

    vocalsRef.current!.currentTime = newPos / 1000;
    accompanimentRef.current!.currentTime = newPos / 1000;

    const newLyricIndex = lyrics.findIndex((line) => line.startTime >= newPos);
    setCurrentLine(newLyricIndex);

    const expectedOffsetByTimeout = lyrics[newLyricIndex - 1]
      ? lyrics[newLyricIndex].startTime -
        lyrics[newLyricIndex - 1].startTime -
        10
      : lyrics[newLyricIndex].startTime - 10;

    tempTimeoutHandle.current = setTimeout(
      () => setTimeoutForNextLine(lyrics, newLyricIndex),
      lyrics[newLyricIndex].startTime - newPos - expectedOffsetByTimeout
    );
  }

  return (
    <div className="song-view">
      <img
        className="back-button"
        role="button"
        src="/img/arrow_back.svg"
        onClick={(e) => history.goBack()}
      />
      <div className="song-row">
      <div className="song-column">
        <SongIcon
          isPlaying={isPlaying}
          imgUrl={song?.images?.sort((a, b) => b.width - a.width)[0]?.url}
        />
        <div className="song-title">{song?.name}</div>
        <div className="artist">{song?.artists.join(", ")}</div>

          <Seeker
            duration={song?.durationMs || 1}
            position={audioPositionMs}
            onChangePosition={onChangePlaybackPos}
          />

        <div className="weight-section">
          <label className="weight-label">
            Lautstärke des Original-Gesangs:
            <input
              type="range"
              min="0"
              max="100"
              className="weight-slider"
              onChange={(e) => onChangeWeight(parseInt(e.target.value) / 100)}
              value={vocalWeight * 100}
            />
          </label>
        </div>
        <div className="weight-section">
          <label className="weight-label">
            Gesamt-Lautstärke:
            <input
              type="range"
              min="0"
              max="100"
              className="weight-slider"
              onChange={(e) => onChangeVolume(parseInt(e.target.value) / 100)}
              value={volume * 100}
            />
          </label>
        </div>
      </div>

      <div className="lyrics-column">
        <div
          className="lyrics"
            style={
              { "--offset-top": lyricsOffset + "px" } as React.CSSProperties
            }
        >
          {lyrics.map((line, i) => (
            <div
              key={line.startTime}
              className={classNames("lyrics-line", {
                "is-current": i === currentLine,
              })}
              ref={i === currentLine ? currentLineElement : null}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>

      <audio className="audio-hidden" ref={accompanimentRef} />
      <audio className="audio-hidden" ref={vocalsRef} />
      </div>
    </div>
  );
}

export default SongView;
