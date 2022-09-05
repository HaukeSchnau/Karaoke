type SliderProps = {
  label: string;
  value: number;
  onChange: (newVal: number) => void;
};

const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => {
  return (
    <div className="mt-4">
      <label className="text-xl">
        {label}
        <input
          type="range"
          min="0"
          max="100"
          className="w-full py-2"
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          value={value * 100}
        />
      </label>
    </div>
  );
};

export default Slider;
