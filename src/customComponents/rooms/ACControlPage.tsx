import React, { useState } from "react";
import "./ACControlPage.css"; // Updated styles

const ACControlPage = () => {
  const [temperature, setTemperature] = useState(25); // Default temperature
  const [power, setPower] = useState(true); // AC power toggle state
  const [activeMode, setActiveMode] = useState("wind"); // Default mode
  const [ecoMode, setEcoMode] = useState(false); // Eco mode state

  const modes = [
    { name: "Wind", icon: "🌬️" },
    { name: "Cool", icon: "❄️" },
    { name: "Dry", icon: "💧" },
    { name: "Auto", icon: "⚙️" },
  ];

  const settings = [
    { name: "8 Hours", description: "Timer" },
    { name: "Eco On", description: "Scenes" },
    { name: "Fast", description: "Swing" },
  ];

  const handleTemperatureChange = (change: number) => {
    // Prevent manual temperature change in Eco mode
    if (!ecoMode) {
      setTemperature((prev) => Math.min(45, Math.max(16, prev + change)));
    }
  };

  const togglePower = () => {
    setPower((prev) => !prev);
  };

  const toggleEcoMode = () => {
    setEcoMode((prev) => {
      if (!prev) {
        // Activating Eco mode sets temperature to 25°C
        setTemperature(25);
      }
      return !prev;
    });
  };

  return (
    <div className="ac-control-container">
      {/* Header */}
      <div className="header">
        <button className="back-button">←</button>
        <h1>Air Conditioner</h1>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Temperature Control */}
      <div className="temperature-control">
        <div className="temperature-circle">
          <button
            className="temp-adjust temp-minus"
            onClick={() => handleTemperatureChange(-1)}
          >
            –
          </button>
          <div className="temperature-display">
            <p className="temperature-value">{temperature}°</p>
            <p className="temperature-unit">Celsius</p>
          </div>
          <button
            className="temp-adjust temp-plus"
            onClick={() => handleTemperatureChange(1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Modes */}
      <div className="modes">
        {modes.map((mode) => (
          <button
            key={mode.name}
            className={`mode-button ${
              activeMode === mode.name.toLowerCase() ? "active" : ""
            }`}
            onClick={() => setActiveMode(mode.name.toLowerCase())}
          >
            <span>{mode.icon}</span>
            {mode.name}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="settings">
        {settings.map((setting, index) => (
          <div
            key={setting.name}
            className={`setting-item ${
              index === 1 && ecoMode ? "eco-active" : ""
            }`} // Add a class when Eco mode is active
            onClick={index === 1 ? toggleEcoMode : undefined} // Toggle Eco mode on "Eco On"
          >
            <p className="setting-name">{setting.name}</p>
            <p className="setting-description">{setting.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ACControlPage;





