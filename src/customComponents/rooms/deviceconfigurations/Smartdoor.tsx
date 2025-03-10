import React, { useState, useEffect } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useParams

interface SmartdoorPageProps {
  deviceId: string;
}

const Smartdoor: React.FC<SmartdoorPageProps> = ({ deviceId }) => {
  const [isLocked, setIsLocked] = useState(true); // Lock/Unlock state
  const [power, setPower] = useState(true); // Power state
  const [loading, setLoading] = useState(true); // Loading state
  const [deviceName, setDeviceName] = useState(""); // Device name state

  const navigate = useNavigate(); // Initialize useNavigate
  const { roomId } = useParams<{ roomId: string }>(); // Extract roomId from the URL
  const location = useLocation();

  // Fetch device data from Firestore in real time
  useEffect(() => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      // Set up a real-time listener for the device document
      const unsubscribe = onSnapshot(deviceDocRef, (deviceDocSnap) => {
        if (deviceDocSnap.exists()) {
          const deviceData = deviceDocSnap.data();
          setIsLocked(deviceData.locked || false); // Default to false if not set
          setPower(deviceData.on || false); // Default to false if not set
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

  // Update lock state in Firestore
  const updateLockState = async (newLockState: boolean) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { locked: newLockState });
        setIsLocked(newLockState); // Update local state
      } catch (error) {
        console.error("Error updating lock state:", error);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  const handleBackButtonClick = () => {
    // Check if the previous route was from AllDevices
    if (location.state?.fromAllDevices) {
      navigate('/alldevices'); // Navigate back to AllDevices
    } else if (roomId) {
      navigate(`/devices/${roomId}`); // Navigate back to the room's devices page
    } else {
      navigate('/home'); // Fallback to home if no roomId or fromAllDevices state
    }
  };

  return (
    <div className="ac-control-container" style={{overflowY: 'auto', height:'auto', paddingBottom:'20%'}}>
      {/* Header */}
      <div className="header" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {/* Back Button */}
        <button className="back-button" onClick={handleBackButtonClick}>←</button>
        <Stack display={'flex'} justify={'center'} align={'center'}>
          <Text fontSize="2xl" fontWeight="bold" color="black" textAlign={'center'} className="deviceNameConfig">
            {deviceName} {/* Display the device name */}
          </Text>
          <Text fontSize="lg" color="black" textAlign={'center'}>
            Smart Door {/* Display "Smart Door" below the device name */}
          </Text>
        </Stack>

        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={() => updatePowerState(!power)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Conjoined Buttons for Lock/Unlock */}
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
          bg={isLocked ? "#6cc358" : "white"}
          color={isLocked ? "white" : "#6cc358"}
          _hover={{ bg: isLocked ? "#6cc358" : "white" }}
          onClick={() => updateLockState(true)} // Set lock state to true
        >
          Lock
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg={!isLocked ? "#6cc358" : "white"}
          color={!isLocked ? "white" : "#6cc358"}
          _hover={{ bg: !isLocked ? "#6cc358" : "white" }}
          onClick={() => updateLockState(false)} // Set lock state to false
        >
          Unlock
        </Button>
      </Box>

      {/* Conjoined Buttons for Power On/Off */}
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
          onClick={() => updatePowerState(true)} // Set power state to true
        >
          On
        </Button>
        <Button
          flex="1"
          borderRadius="0"
          bg={!power ? "#6cc358" : "white"}
          color={!power ? "white" : "#6cc358"}
          _hover={{ bg: !power ? "#6cc358" : "white" }}
          onClick={() => updatePowerState(false)} // Set power state to false
        >
          Off
        </Button>
      </Box>
    </div>
  );
};

export default Smartdoor;