import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LyricsView from "../components/LyricsView";
import Seeker from "../components/Seeker";
import Slider from "../components/Slider";
import SongIcon from "../components/SongIcon";
import NowPlaying from "../store/NowPlaying";
import { LyricLine, Song } from "../types";
import "./SongView.css";

interface SongViewParams {
  id: string;
}

const SongView: React.FC = () => {
  const { id } = useParams<SongViewParams>();
  const history = useHistory();

  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  const accompanimentRef = useRef<HTMLAudioElement>(null);
  const vocalsRef = useRef<HTMLAudioElement>(null);

  const timeTrackingInterval = useRef(-1);

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

      const newNowPlaying = new NowPlaying(song, newLyrics);
      setNowPlaying(newNowPlaying);

      accompanimentRef.current?.play();
      vocalsRef.current?.play();

      timeTrackingInterval.current = setInterval(() => {
        if (vocalsRef.current == null || accompanimentRef.current == null)
          return;

        const seconds = accompanimentRef.current.currentTime || 0;
        newNowPlaying.audioPosition = seconds * 1000;
      }, 100);

      vocalsRef.current!.volume = newNowPlaying.vocalVolume;
      accompanimentRef.current!.volume = newNowPlaying.volume;

      console.log(accompaniment);

      newNowPlaying.isPlaying = true;
    })();

    return () => {
      setNowPlaying(null);

      clearInterval(timeTrackingInterval.current);
    };
  }, []);

  function onChangeWeight(newVocalWeight: number) {
    if (nowPlaying) {
      nowPlaying.vocalWeight = newVocalWeight;
      vocalsRef.current!.volume = nowPlaying.vocalVolume;
    }
  }

  function onChangeVolume(newVolume: number) {
    if (nowPlaying) {
      nowPlaying.volume = newVolume;
      accompanimentRef.current!.volume = nowPlaying.volume;
      vocalsRef.current!.volume = nowPlaying.vocalVolume;
    }
  }

  function onChangePlaybackPos(newPos: number) {
    if (nowPlaying) {
      nowPlaying.audioPosition = newPos;
    }

    vocalsRef.current!.currentTime = newPos / 1000;
    accompanimentRef.current!.currentTime = newPos / 1000;
  }

  return (
    <div className="song-view">
      <img
        className="back-button"
        role="button"
        src="/img/arrow_back.svg"
        onClick={() => history.goBack()}
      />
      <div className="song-row">
        <div className="song-column">
          <SongIcon
            isPlaying={nowPlaying?.isPlaying}
            imgUrl={
              nowPlaying?.song.images?.sort((a, b) => b.width - a.width)[0]?.url
            }
          />
          <div className="song-title">{nowPlaying?.song.name}</div>
          <div className="artist">{nowPlaying?.song.artists.join(", ")}</div>

          <Seeker
            duration={nowPlaying?.song.durationMs || 1}
            position={nowPlaying?.audioPosition ?? 0}
            onChangePosition={onChangePlaybackPos}
          />

          <Slider
            label="Lautstärke des Original-Gesangs:"
            value={nowPlaying?.vocalWeight ?? 0}
            onChange={onChangeWeight}
          />

          <Slider
            label="Gesamt-Lautstärke:"
            value={nowPlaying?.volume ?? 0}
            onChange={onChangeVolume}
          />
        </div>

        <div className="lyrics-column">
          {nowPlaying && <LyricsView nowPlaying={nowPlaying} />}
        </div>

        <audio className="hidden" ref={accompanimentRef} />
        <audio className="hidden" ref={vocalsRef} />
      </div>
    </div>
  );
};

export default observer(SongView);
