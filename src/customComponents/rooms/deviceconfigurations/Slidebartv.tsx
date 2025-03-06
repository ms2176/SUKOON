import React from 'react';
import './SB.css';

interface SlidebartvProps {
  title?: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
}

const Slidebartv: React.FC<SlidebartvProps> = ({ title, unit = "KW", value, onChange }) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div style={{ background: 'transparent' }}>
      {title && <h3 style={{ background: 'transparent' }} className="PB-range-slider-title">{title}</h3>}
      <div className="PB-range-slider-div">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          className="PB-range-slider"
          id="myRange"
          onChange={handleSliderChange}
        />
        <p className="PB-range-slidervalue">{value}{unit}</p>
      </div>
    </div>
  );
};

export default Slidebartv;