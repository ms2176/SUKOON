import React, { useState, useEffect, useRef } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button, Spinner, Text, Stack } from "@chakra-ui/react";
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useParams
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";

interface WashingmachinePageProps {
  deviceId: string;
}

const Washingmachine: React.FC<WashingmachinePageProps> = ({ deviceId }) => {
  const [timer, setTimer] = useState("00:00"); // Timer display
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is running
  const [activeMode, setActiveMode] = useState<string | null>(null); // Track active mode (Cotton, Fabric, Polyester)
  const [activeRPM, setActiveRPM] = useState<string | null>(null); // Track active RPM (400, 800, 1200)
  const [activeDuration, setActiveDuration] = useState<string | null>(null); // Track active duration (1hr, 2hr, 3hr)
  const [isPaused, setIsPaused] = useState(false); // Track if the timer is paused
  const [power, setPower] = useState(true); // Power toggle state
  const [remainingTime, setRemainingTime] = useState(0); // Track remaining time when paused
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate
  const { roomId } = useParams<{ roomId: string }>(); // Extract roomId from the URL
  const [deviceName, setDeviceName] = useState(""); // Device name state
  const [activeButton, setActiveButton] = useState<"start" | "pause" | "continue" | "end" | null>(null); // Track active button
  const location = useLocation();

  const modes = ["Cotton", "Fabric", "Polyester"];
  const rpms = ["400 RPM", "800 RPM", "1200 RPM"];
  const durations = ["1hr", "2hr", "3hr"];

  // Ref to store the interval ID for the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch device data from Firestore in real time
  useEffect(() => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      // Set up a real-time listener for the device document
      const unsubscribe = onSnapshot(deviceDocRef, (deviceDocSnap) => {
        if (deviceDocSnap.exists()) {
          const deviceData = deviceDocSnap.data();
          setPower(deviceData.on || false); // Set power state
          setActiveMode(deviceData.clothType || null); // Set active mode
          setActiveRPM(deviceData.rpm || null); // Set active RPM
          setActiveDuration(deviceData.length || null); // Set active duration
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

  // Update cloth type in Firestore
  const updateClothType = async (newClothType: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { clothType: newClothType });
        setActiveMode(newClothType); // Update local state
      } catch (error) {
        console.error("Error updating cloth type:", error);
      }
    }
  };

  // Update RPM in Firestore
  const updateRPM = async (newRPM: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { rpm: newRPM });
        setActiveRPM(newRPM); // Update local state
      } catch (error) {
        console.error("Error updating RPM:", error);
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

  // Function to start the timer
  const startTimer = () => {
    if (isRunning || !activeDuration) return; // Prevent starting if no duration is selected

    setIsRunning(true);
    setIsPaused(false);
    setActiveButton("start"); // Set the active button to "start"

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
        setActiveButton(null); // Reset active button when timer ends
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
    setActiveButton("pause"); // Set the active button to "pause"

    // Save the remaining time when paused
    const [minutes, seconds] = timer.split(":").map(Number);
    setRemainingTime(minutes * 60 + seconds);
  };

  // Function to continue the timer
  const continueTimer = () => {
    if (isRunning || !remainingTime) return; // Prevent continuing if no remaining time

    setIsRunning(true);
    setIsPaused(false);
    setActiveButton("continue"); // Set the active button to "continue"

    let time = remainingTime;

    timerRef.current = setInterval(() => {
      time -= 1;
      if (time < 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimer("00:00");
        setActiveButton(null); // Reset active button when timer ends
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
    setActiveButton("end"); // Set the active button to "end"
  };

  // Function to handle mode selection
  const handleModeChange = (mode: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateClothType(mode);
  };

  // Function to handle RPM selection
  const handleRPMChange = (rpm: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateRPM(rpm);
  };

  // Function to handle duration selection
  const handleDurationChange = (duration: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    updateDuration(duration);
    setTimer(`${duration}:00`); // Update the timer display to the selected duration
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
        <button className="back-button" onClick={handleBackButtonClick}>←</button>
        <Stack display={'flex'} justify={'center'} align={'center'}>
          <Text fontSize="2xl" fontWeight="bold" color="black" textAlign={'center'} className="deviceNameConfig">
            {deviceName} {/* Display the device name */}
          </Text>
          <Text fontSize="lg" color="black" textAlign={'center'}>
            Washing Machine {/* Display "Washing Machine" below the device name */}
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
      <div className="temperature-control" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div className="temperature-circle">
          <div className="temperature-display">
            <p className="temperature-value">{timer}</p>
            <p className="temperature-unit">Remaining</p>
          </div>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="modes" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {modes.map((mode) => (
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
      <div className="modes" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {rpms.map((rpm) => (
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
      <div className="modes" style={{ padding: '20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        {durations.map((duration) => (
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
          bg={activeButton === "start" ? "#6cc358" : "white"}
          color={activeButton === "start" ? "white" : "#6cc358"}
          onClick={startTimer}
          _disabled={{ opacity: 1, bg: isRunning ? "#6cc358" : "white", color: isRunning ? "white" : "#6cc358" }}
        >
          Start
        </Button>

        {/* Pause Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={activeButton === "pause" ? "#6cc358" : "white"}
          color={activeButton === "pause" ? "white" : "#6cc358"}
          onClick={pauseTimer}
          _disabled={{ opacity: 1, bg: !isRunning ? "#6cc358" : "white", color: !isRunning ? "white" : "#6cc358" }}
        >
          Pause
        </Button>

        {/* Continue Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={activeButton === "continue" ? "#6cc358" : "white"}
          color={activeButton === "continue" ? "white" : "#6cc358"}
          onClick={continueTimer}
          _disabled={{ opacity: 1, bg: !isPaused ? "#6cc358" : "white", color: !isPaused ? "white" : "#6cc358" }}
        >
          Continue
        </Button>

        {/* End Button */}
        <Button
          flex="1"
          borderRadius="0"
          bg={activeButton === "end" ? "#6cc358" : "white"}
          color={activeButton === "end" ? "white" : "#6cc358"}
          onClick={endTimer}
          _disabled={{ opacity: 1, bg: !isPaused && !isRunning ? "#6cc358" : "white", color: !isPaused && !isRunning ? "white" : "#6cc358" }}
        >
          End
        </Button>
      </Box>

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

export default Washingmachine;