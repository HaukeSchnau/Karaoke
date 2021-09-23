import React from "react";
import "./Seeker.css";

type SeekerProps = {
  position: number;
  duration: number;
  onChangePosition: (pos: number) => void;
};

function formatTime(ms: number) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds - minutes * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Seeker({
  position,
  duration,
  onChangePosition,
}: SeekerProps) {
  return (
    <div className="seeker-root">
      <input
        type="range"
        min="0"
        max={duration}
        onChange={(e) => onChangePosition(parseFloat(e.target.value))}
        value={position}
      />

      <div className="times">
        <div className="current">{formatTime(position)}</div>
        <div className="total">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
