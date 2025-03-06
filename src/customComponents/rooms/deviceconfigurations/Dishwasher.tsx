import React, { useState, useEffect, useRef } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useParams

interface DishwasherPageProps {
  deviceId: string;
}

const Dishwasher: React.FC<DishwasherPageProps> = ({ deviceId }) => {
  const [timer, setTimer] = useState("00:00"); // Timer display
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is running
  const [activeMode, setActiveMode] = useState<string | null>(null); // Track active mode (Cold, Warm, Hot)
  const [activeRPM, setActiveRPM] = useState<string | null>(null); // Track active RPM (Water, Soap)
  const [activeDuration, setActiveDuration] = useState<string | null>(null); // Track active duration (1hr, 2hr, 3hr)
  const [isPaused, setIsPaused] = useState(false); // Track if the timer is paused
  const [power, setPower] = useState(true); // Power state
  const [remainingTime, setRemainingTime] = useState(0); // Track remaining time when paused
  const [loading, setLoading] = useState(true); // Loading state
  const [deviceName, setDeviceName] = useState(""); // Device name state

  const navigate = useNavigate(); // Initialize useNavigate
  const { roomId } = useParams<{ roomId: string }>(); // Extract roomId from the URL
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID for the timer
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
          setPower(deviceData.on || true); // Default to true if not set
          setActiveMode(deviceData.waterTemp || null); // Set water temperature mode
          setActiveRPM(deviceData.soap ? "Soap" : "Water"); // Set soap state
          setActiveDuration(deviceData.length || null); // Set duration
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

  // Update water temperature in Firestore
  const updateWaterTemp = async (newWaterTemp: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { waterTemp: newWaterTemp });
        setActiveMode(newWaterTemp); // Update local state
      } catch (error) {
        console.error("Error updating water temperature:", error);
      }
    }
  };

  // Update soap state in Firestore
  const updateSoap = async (newSoap: boolean) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { soap: newSoap });
        setActiveRPM(newSoap ? "Soap" : "Water"); // Update local state
      } catch (error) {
        console.error("Error updating soap state:", error);
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

  // Update duration in Firestore
  const updateDuration = async (newDuration: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { length: newDuration });
        setActiveDuration(newDuration); // Update local state
      } catch (error) {
        console.error("Error updating duration:", error);
      }
    }
  };

  // Function to start the timer
  const startTimer = () => {
    if (isRunning || !activeDuration) return; // Prevent starting if no duration is selected

    setIsRunning(true);
    setIsPaused(false);

    // Convert the selected duration to seconds
    const durationInSeconds = parseInt(activeDuration) * 3600; // Convert hours to seconds
    let time = durationInSeconds;

    timerRef.current = setInterval(() => {
      time -= 1;
      if (time < 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimer("00:00");
        return;
      }

      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }, 1000); // Update every second
  };

  // Function to pause the timer
  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(true);

    // Save the remaining time when paused
    const [minutes, seconds] = timer.split(":").map(Number);
    setRemainingTime(minutes * 60 + seconds);
  };

  // Function to continue the timer
  const continueTimer = () => {
    if (isRunning || !remainingTime) return; // Prevent continuing if no remaining time

    setIsRunning(true);
    setIsPaused(false);

    let time = remainingTime;

    timerRef.current = setInterval(() => {
      time -= 1;
      if (time < 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimer("00:00");
        return;
      }

      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }, 1000); // Update every second
  };

  // Function to end the timer
  const endTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer("00:00");
    setIsRunning(false);
    setIsPaused(false);
    setRemainingTime(0); // Reset remaining time
  };

  const togglePower = () => {
    updatePowerState(!power);
  };

  // Function to handle mode selection
  const handleModeChange = (mode: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateWaterTemp(mode);
  };

  // Function to handle RPM selection
  const handleRPMChange = (rpm: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateSoap(rpm === "Soap");
  };

  // Function to handle duration selection
  const handleDurationChange = (duration: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateDuration(duration);
    setTimer(`${duration}:00`); // Update the timer display to the selected duration
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }
   // Get the current location

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

  return (
    <div className="ac-control-container" style={{overflowY: 'auto', height:'auto', paddingBottom:'20%'}}>
      {/* Header */}
      <div className="header" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <button className="back-button" onClick={handleBackButtonClick}>←</button>
        <Stack display={'flex'} justify={'center'} align={'center'}>
          <Text fontSize="2xl" fontWeight="bold" color="black" textAlign={'center'} className="deviceNameConfig">
            {deviceName} {/* Display the device name */}
          </Text>
          <Text fontSize="lg" color="black" textAlign={'center'}>
            Dishwasher {/* Display "Smart Door" below the device name */}
          </Text>
        </Stack>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      {/* Timer Display */}
      <div className="temperature-control" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <div className="temperature-circle">
          <div className="temperature-display">
            <p className="temperature-value">{timer}</p>
            <p className="temperature-unit">Remaining</p>
          </div>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="modes" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        {["Cold", "Warm", "Hot"].map((mode) => (
          <button
            key={mode}
            className={`mode-button ${activeMode === mode ? "active" : ""}`}
            onClick={() => handleModeChange(mode)}
            disabled={isRunning} // Disable if the timer is running
          >
            {mode}
          </button>
        ))}
      </div>

      {/* RPM Buttons */}
      <div className="modes" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        {["Water", "Soap"].map((rpm) => (
          <button
            key={rpm}
            className={`mode-button ${activeRPM === rpm ? "active" : ""}`}
            onClick={() => handleRPMChange(rpm)}
            disabled={isRunning} // Disable if the timer is running
          >
            {rpm}
          </button>
        ))}
      </div>

      {/* Duration Buttons */}
      <div className="modes" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        {["1hr", "2hr", "3hr"].map((duration) => (
          <button
            key={duration}
            className={`mode-button ${activeDuration === duration ? "active" : ""}`}
            onClick={() => handleDurationChange(duration)}
            disabled={isRunning} // Disable if the timer is running
          >
            {duration}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="20px"
        overflow="hidden"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        width="100%"
        maxWidth="400px" // Adjusted width to fit all buttons
        margin="20px auto"
      >
        {/* Start Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={isRunning ? "#6cc358" : "white"}
          color={isRunning ? "white" : "#6cc358"}
          onClick={startTimer}
          disabled={isRunning || !activeDuration}
        >
          Start
        </Button>

        {/* Pause Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={isPaused ? "#6cc358" : "white"}
          color={isPaused ? "white" : "#6cc358"}
          onClick={pauseTimer}
          disabled={!isRunning}
        >
          Pause
        </Button>

        {/* Continue Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={isPaused ? "#6cc358" : "white"}
          color={isPaused ? "white" : "#6cc358"}
          onClick={continueTimer}
          disabled={!isPaused}
        >
          Continue
        </Button>

        {/* End Button */}
        <Button
          flex="1"
          borderRadius="0"
          bg={isRunning || isPaused ? "#6cc358" : "white"}
          color={isRunning || isPaused ? "white" : "#6cc358"}
          onClick={endTimer}
          disabled={!isRunning && !isPaused}
        >
          End
        </Button>
      </Box>

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
              >
                Off
              </Button>
            </Box>
    </div>
  );
};

export default Dishwasher;