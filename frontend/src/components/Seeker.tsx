import React from "react";
import { formatTime } from "../util/time";
import "./Seeker.css";

interface SeekerProps {
  position: number;
  duration: number;
  onChangePosition: (pos: number) => void;
}

const Seeker: React.FC<SeekerProps> = ({
  position,
  duration,
  onChangePosition,
}) => {
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
};

export default Seeker;
