import React, { useState } from 'react';
import './DeviceDetailPage.css'; // Import the CSS file

const Slider= () => {
  const [temperature, setTemperature] = useState(20); // Initial temperature value

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(event.target.value)); // Update temperature on slider change
  };

  return (
    <div className="device-detail-container">
      {/* Temperature Display */}
      <div className="temperature-display">
        <p>{temperature}°C</p>
      </div>

      {/* Vertical Slider */}
      <div className="slider-container">
        <input
          type="range"
          min="10"
          max="45"
          value={temperature}
          onChange={handleSliderChange}
          className="slider"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </div>

      <p>Drag the slider to adjust the temperature.</p>
    </div>
  );
};

export default Slider;



