import React, { useState, useEffect } from 'react';
import './slidebar.css';

interface SlidebarProps {
  title?: string;          // Optional prop for the header
  unit?: string;           // Optional prop for the measurement unit, defaults to "KW"
  max?: number;            // Optional prop for the maximum value of the slider, defaults to 100
  allowDecimals?: boolean; // Optional prop to allow decimal values, defaults to false
  onChange?: (value: number) => void; // Callback to pass the slider value to the parent
  initialValue?: number;   // New prop for the initial slider value
}

const Slidebar: React.FC<SlidebarProps> = ({
  title,
  unit = "KW",
  max = 100,
  allowDecimals = false,
  onChange,
  initialValue = 0,
}) => {
  // Initialize sliderValue with initialValue instead of 0
  const [sliderValue, setSliderValue] = useState<number>(initialValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  // Update sliderValue when initialValue changes
  useEffect(() => {
    setSliderValue(initialValue);
  }, [initialValue]);

  // Function to handle slider value change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    const roundedValue = allowDecimals ? parseFloat(value.toFixed(1)) : Math.round(value);
    setSliderValue(roundedValue);
    if (onChange) {
      onChange(roundedValue);
    }
  };

  // Function to handle manual input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  // Function to handle manual input submission
  const handleInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      let newValue = value;
      if (value < 0) {
        newValue = 0; // Default to 0 if the value is negative
      } else if (value > max) {
        newValue = max; // Set to max if the value exceeds the maximum
      }
      const roundedValue = allowDecimals ? parseFloat(newValue.toFixed(1)) : Math.round(newValue);
      setSliderValue(roundedValue);
      if (onChange) {
        onChange(roundedValue);
      }
    }
    setIsEditing(false);
  };

  // Function to toggle manual input mode
  const toggleEditMode = () => {
    setIsEditing(true);
    setInputValue(sliderValue.toString());
  };

  return (
    <div style={{ background: 'transparent' }}>
      {title && (
        <h3 style={{ background: 'transparent' }} className="PB-range-slider-title">
          {title}
        </h3>
      )}
      <div className="PB-range-slider-div">
        <input
          type="range"
          min="0"
          max={max}
          value={sliderValue}
          className="PB-range-slider"
          id="myRange"
          onChange={handleSliderChange}
          step={allowDecimals ? 0.1 : 1}
        />
        {isEditing ? (
          <form onSubmit={handleInputSubmit} style={{ display: 'inline-block' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputSubmit}
              autoFocus
              className="PB-range-slidervalue-input"
              style={{ width: '60px', textAlign: 'center' }}
            />
          </form>
        ) : (
          <p className="PB-range-slidervalue" onClick={toggleEditMode}>
            {sliderValue}
            {unit}
          </p>
        )}
      </div>
    </div>
  );
};

export default Slidebar;
