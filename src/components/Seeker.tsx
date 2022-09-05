import { formatTime } from "@src/utils/formatTime";
import React from "react";

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
    <div className="mt-4">
      <input
        type="range"
        min="0"
        max={duration}
        onChange={(e) => onChangePosition(parseFloat(e.target.value))}
        value={position}
      />

      <div className="flex justify-between">
        <div>{formatTime(position)}</div>
        <div>{formatTime(duration)}</div>
      </div>
    </div>
  );
};

export default Seeker;
