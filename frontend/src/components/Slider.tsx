import React from "react";
import "./Slider.css";

type SliderProps = {
  label: string;
  value: number;
  onChange: (newVal: number) => void;
};

const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => {
  return (
    <div className="weight-section">
      <label className="weight-label">
        {label}
        <input
          type="range"
          min="0"
          max="100"
          className="weight-slider"
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          value={value * 100}
        />
      </label>
    </div>
  );
};

export default Slider;
