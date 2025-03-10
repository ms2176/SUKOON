import React, { useState } from 'react';
import './slidebar.css';

interface SlidebarProps {
  title?: string; // Optional prop for the header
  unit?: string; // Optional prop for the measurement unit, defaults to KW
}

const Slidebar: React.FC<SlidebarProps> = ({ title, unit = "KW" }) => {
  const [sliderValue, setSliderValue] = useState(50); // State to track the slider value

  // Function to handle slider value change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  return (
    <div style={{background: 'transparent'}}>
      {title && <h3  style={{background: 'transparent'}} className="PB-range-slider-title">{title}</h3>} {/* Display title if provided */}
      <div className="PB-range-slider-div">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          className="PB-range-slider"
          id="myRange"
          onChange={handleSliderChange} // Update value on change
        />
        <p className="PB-range-slidervalue">{sliderValue}{unit}</p> {/* Display updated value with unit */}
      </div>
    </div>
  );
};

export default Slidebar;