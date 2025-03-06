import React, { useState, useEffect } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";

interface HeatConvectorProps {
  deviceId: string;
}

const HeatConvector: React.FC<HeatConvectorProps> = ({ deviceId }) => {
  const [temperature, setTemperature] = useState(25); // Default temperature
  const [power, setPower] = useState(true); // Power toggle state
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate
  const { roomId } = useParams<{ roomId: string }>(); // Extract roomId from the URL
  const [deviceName, setDeviceName] = useState(""); // Device name state

  // Fetch device data from Firestore in real time
  useEffect(() => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      // Set up a real-time listener for the device document
      const unsubscribe = onSnapshot(deviceDocRef, (deviceDocSnap) => {
        if (deviceDocSnap.exists()) {
          const deviceData = deviceDocSnap.data();
          setTemperature(deviceData.temp || 25); // Set temperature
          setPower(deviceData.on || false); // Set power state
          setDeviceName(deviceData.deviceName || "Unnamed Device"); // Set device name

        } else {
          console.error("Device not found");
        }
        setLoading(false); // Stop loading once data is fetched
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [deviceId]);

  // Update temperature in Firestore
  const updateTemperature = async (newTemp: number) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { temp: newTemp.toString() }); // Update temp as a string
        setTemperature(newTemp); // Update local state
      } catch (error) {
        console.error("Error updating temperature:", error);
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

  // Handle temperature change
  const handleTemperatureChange = (change: number) => {
    const newTemp = Math.min(100, Math.max(0, temperature + change)); // Clamp between 0 and 100
    updateTemperature(newTemp);
  };

  // Toggle power state
  const togglePower = () => {
    updatePowerState(!power);
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
        <button className="back-button" onClick={() => navigate(`/devices/${roomId}`)}>←</button>
          <Stack display={'flex'} justify={'center'} align={'center'}>
            <Text fontSize="2xl" fontWeight="bold" color="black" textAlign={'center'} className="deviceNameConfig">
              {deviceName} {/* Display the device name */}
            </Text>
            <Text fontSize="lg" color="black" textAlign={'center'}>
              Heat Convector {/* Display "Smart Door" below the device name */}
            </Text>
          </Stack>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Temperature Control */}
      <div className="temperature-control" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div className="temperature-circle">
          <button
            className="temp-adjust temp-minus"
            onClick={() => handleTemperatureChange(-1)}
            aria-label="Decrease temperature"
          >
            -
          </button>
          <div className="temperature-display">
            <p className="temperature-value">{temperature}°</p>
            <p className="temperature-unit">Temperature</p>
          </div>
          <button
            className="temp-adjust temp-plus"
            onClick={() => handleTemperatureChange(1)}
            aria-label="Increase temperature"
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

export default HeatConvector;