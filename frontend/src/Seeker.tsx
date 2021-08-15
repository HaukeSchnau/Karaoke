import React from "react";
import "./Seeker.css";

type SeekerProps = {
  position: number;
  duration: number;
};

function formatTime(ms: number) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds - minutes * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Seeker({ position, duration }: SeekerProps) {
  return (
    <div className="seeker-root">
      <svg viewBox="0 0 1000 50" width="100%" className="seeker">
        <rect x="0" width="1000" y="20" height="10" fill="#fff" rx="5" />
        <circle cx={(position / duration) * 1000} cy="25" r={25} fill="#fff" />
      </svg>
      <div className="times">
        <div className="current">{formatTime(position)}</div>
        <div className="total">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
