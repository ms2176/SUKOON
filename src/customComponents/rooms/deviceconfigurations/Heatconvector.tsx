import React, { useState, useRef } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { useParams } from 'react-router-dom';
import { Box, Button } from "@chakra-ui/react";
import { BsLightbulbFill } from "react-icons/bs";
import { BsLightbulb } from "react-icons/bs";
import { BsLightbulbOff } from "react-icons/bs";

const Heatconvector = () => {
  const [luminosity, setLuminosity] = useState(25); // Default luminosity
  const [power, setPower] = useState(true); // Light power toggle state
  const [activeMode, setActiveMode] = useState<string | null>(null); // Track active mode
  const [ecoMode, setEcoMode] = useState(false); // Eco mode state
  const [isManuallyAdjusted, setIsManuallyAdjusted] = useState(false); // Track manual adjustments

  const modes = [
    { name: "Off", icon: <BsLightbulbOff /> },
    { name: "Dim", icon: <BsLightbulb /> },
    { name: "Bright", icon: <BsLightbulbFill /> },
  ];

  const settings = [
    { name: "8 Hours", description: "Timer" },
    { name: "Eco On", description: "Scenes" },
  ];

  // Ref to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startChangingLuminosity = (change: number) => {
    if (intervalRef.current) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      setLuminosity((prev) => {
        const newValue = prev + change;
        return Math.min(100, Math.max(0, newValue)); // Clamp between 0 and 100
      });
      setIsManuallyAdjusted(true); // Mark as manually adjusted
    }, 100); // Adjust the interval speed as needed
  };

  const stopChangingLuminosity = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePower = () => {
    setPower((prev) => !prev);
  };

  const toggleEcoMode = () => {
    setEcoMode((prev) => {
      if (!prev) {
        // Activating Eco mode sets luminosity to 40%
        setLuminosity(40);
      } else {
        // Deactivating Eco mode resets luminosity to the previous value
        setLuminosity(25); // You can adjust this to a more appropriate value if needed
      }
      return !prev;
    });
  };

  const handleModeChange = (mode: string) => {
    setActiveMode(mode.toLowerCase());
    setIsManuallyAdjusted(false); // Reset manual adjustment flag

    // Set luminosity based on the selected mode
    switch (mode.toLowerCase()) {
      case "bright":
        setLuminosity(80);
        break;
      case "dim":
        setLuminosity(50);
        break;
      case "off":
        setLuminosity(0);
        break;
      default:
        setLuminosity(25); // Default value
        break;
    }
  };

  return (
    <div className="ac-control-container">
      {/* Header */}
      <div className="header" style={{padding: '20px', borderRadius:'20px', boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
        <button className="back-button">←</button>
        <h1>Heat Convector</h1>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Luminosity Control */}
      <div className="temperature-control" style={{padding: '20px', borderRadius:'20px', boxShadow:'0 4px 8px rgba(0, 0, 0, 0.2)'}}>
        <div className="temperature-circle">
          <button
            className="temp-adjust temp-minus"
            onTouchEnd={stopChangingLuminosity}
            onTouchStart={() => startChangingLuminosity(-1)}
            onMouseDown={() => startChangingLuminosity(-1)}
            onMouseUp={stopChangingLuminosity}
            onMouseLeave={stopChangingLuminosity} // Stop if the mouse leaves the button
          >
            -
          </button>
          <div className="temperature-display">
            <p className="temperature-value">{luminosity}°</p>
            <p className="temperature-unit">Temperature</p>
          </div>
          <button
            className="temp-adjust temp-plus"
            onTouchEnd={stopChangingLuminosity}
            onTouchStart={() => startChangingLuminosity(1)}
            onMouseDown={() => startChangingLuminosity(1)}
            onMouseUp={stopChangingLuminosity}
            onMouseLeave={stopChangingLuminosity} // Stop if the mouse leaves the button
          >
            +
          </button>
        </div>
      </div>

      {/* Conjoined Buttons */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="20px"
        overflow="hidden"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        width="100%"
        maxWidth="300px"
        margin="20px auto"
      >
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={power ? "#6cc358" : "white"}
          color={power ? "white" : "#6cc358"}
          _hover={{ bg: power ? "#6cc358" : "white" }}
          onClick={() => setPower(true)}
        >
          Off
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg={!power ? "#6cc358" : "white"}
          color={!power ? "white" : "#6cc358"}
          _hover={{ bg: !power ? "#6cc358" : "white" }}
          onClick={() => setPower(false)}
        >
          On
        </Button>
      </Box>
    </div>
  );
};

export default Heatconvector;