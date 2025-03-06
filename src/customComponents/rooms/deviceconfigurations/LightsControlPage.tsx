import React, { useState, useEffect } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button, Spinner } from "@chakra-ui/react";
import { BsLightbulbFill, BsLightbulb, BsLightbulbOff } from "react-icons/bs";
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useParams
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";


interface LightsControlPageProps {
  deviceId: string;
}

const LightsControlPage: React.FC<LightsControlPageProps> = ({ deviceId }) => {
  const [luminosity, setLuminosity] = useState(25); // Default luminosity
  const [power, setPower] = useState(true); // Light power toggle state
  const [activeMode, setActiveMode] = useState<string | null>(null); // Track active mode
  const [autoMode, setAutoMode] = useState<string>("timer"); // Auto mode state (timer, eco)
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate
  const { roomId } = useParams<{ roomId: string }>(); // Extract roomId from the URL
  const location = useLocation();

  // Modes with icons
  const modes = [
    { name: "Off", value: "off", icon: <BsLightbulbOff /> },
    { name: "Dim", value: "dim", icon: <BsLightbulb /> },
    { name: "Bright", value: "bright", icon: <BsLightbulbFill /> },
  ];

  // Settings with descriptions
  const settings = [
    { name: "8 Hours", value: "timer", description: "Timer" },
    { name: "Eco On", value: "eco", description: "Scenes" },
  ];

  // Fetch device data from Firestore in real time
  useEffect(() => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      // Set up a real-time listener for the device document
      const unsubscribe = onSnapshot(deviceDocRef, (deviceDocSnap) => {
        if (deviceDocSnap.exists()) {
          const deviceData = deviceDocSnap.data();
          setLuminosity(parseInt(deviceData.brightness) || 25); // Set brightness
          setPower(deviceData.on || false); // Set power state
          setActiveMode(deviceData.brightnessMode || null); // Set active mode
          setAutoMode(deviceData.autoMode || "timer"); // Set auto mode
        } else {
          console.error("Device not found");
        }
        setLoading(false); // Stop loading once data is fetched
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [deviceId]);

  // Update brightness in Firestore
  const updateBrightness = async (newBrightness: number) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { brightness: newBrightness.toString() }); // Update brightness as a string
        setLuminosity(newBrightness); // Update local state
      } catch (error) {
        console.error("Error updating brightness:", error);
      }
    }
  };

  // Update power state in Firestore
  const updatePowerState = async (newPowerState: boolean) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { on: newPowerState });
        setPower(newPowerState); // Update local state
      } catch (error) {
        console.error("Error updating power state:", error);
      }
    }
  };

  // Update brightness mode in Firestore
  const updateBrightnessMode = async (newMode: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { brightnessMode: newMode });
        setActiveMode(newMode); // Update local state
      } catch (error) {
        console.error("Error updating brightness mode:", error);
      }
    }
  };

  // Update auto mode in Firestore
  const updateAutoMode = async (newMode: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { autoMode: newMode });
        setAutoMode(newMode); // Update local state
      } catch (error) {
        console.error("Error updating auto mode:", error);
      }
    }
  };

  // Handle luminosity change
  const handleLuminosityChange = (change: number) => {
    const newLuminosity = Math.min(100, Math.max(0, luminosity + change)); // Clamp between 0 and 100
    updateBrightness(newLuminosity);
  };

  // Toggle power state
  const togglePower = () => {
    updatePowerState(!power);
  };

  // Handle mode change
  const handleModeChange = (mode: string) => {
    updateBrightnessMode(mode);
    switch (mode) {
      case "bright":
        updateBrightness(80);
        break;
      case "dim":
        updateBrightness(50);
        break;
      case "off":
        updateBrightness(0);
        break;
      default:
        updateBrightness(25); // Default value
        break;
    }
  };

  const handleBackButtonClick = () => {
    // Check if the previous route was from AllDevices
    if (location.state?.fromAllDevices) {
      navigate('/alldevices'); // Navigate back to AllDevices
    } else if (roomId) {
      navigate(`/devices/${roomId}`); // Navigate back to the room's devices page
    } else {
      navigate('/'); // Fallback to home if no roomId or fromAllDevices state
    }
  };

  // Handle setting selection (8 Hours or Eco On)
  const handleSettingSelection = (settingValue: string) => {
    if (settingValue === "timer") {
      updateAutoMode("timer"); // Set autoMode to "timer" for 8-hour timer
    } else if (settingValue === "eco") {
      updateAutoMode("eco"); // Set autoMode to "eco" for eco mode
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <div className="ac-control-container" style={{ overflowY: 'auto', height: 'auto', paddingBottom: '20%' }}>
      {/* Header */}
      <div className="header" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <button className="back-button" onClick={handleBackButtonClick}>←</button>
        <h1>Light</h1>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Luminosity Control */}
      <div className="temperature-control" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div className="temperature-circle">
          <button
            className="temp-adjust temp-minus"
            onClick={() => handleLuminosityChange(-1)}
            aria-label="Decrease brightness"
          >
            -
          </button>
          <div className="temperature-display">
            <p className="temperature-value">{luminosity}%</p>
            <p className="temperature-unit">Brightness</p>
          </div>
          <button
            className="temp-adjust temp-plus"
            onClick={() => handleLuminosityChange(1)}
            aria-label="Increase brightness"
          >
            +
          </button>
        </div>
      </div>

      {/* Modes */}
      <div className="modes" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {modes.map((mode) => (
          <button
            key={mode.value}
            className={`mode-button ${activeMode === mode.value ? "active" : ""}`}
            onClick={() => handleModeChange(mode.value)}
          >
            <span>{mode.icon}</span>
            {mode.name}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="settings" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {settings.map((setting) => (
          <div
            key={setting.value}
            style={{
              cursor: 'pointer',
              padding: '10px',
              color: autoMode === setting.value ? '#6cc358' : 'inherit',
              transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            }}
            className={`setting-item ${autoMode === setting.value ? "active" : ""}`}
            onClick={() => handleSettingSelection(setting.value)}
          >
            <p className="setting-name">{setting.name}</p>
            <p className="setting-description">{setting.description}</p>
          </div>
        ))}
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
          onClick={() => updatePowerState(true)}
          aria-label="Turn on"
        >
          On
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg={!power ? "#6cc358" : "white"}
          color={!power ? "white" : "#6cc358"}
          _hover={{ bg: !power ? "#6cc358" : "white" }}
          onClick={() => updatePowerState(false)}
          aria-label="Turn off"
        >
          Off
        </Button>
      </Box>
    </div>
  );
};

export default LightsControlPage;