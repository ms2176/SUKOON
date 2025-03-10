import React, { useState, useEffect, useRef } from "react";
import "../DeviceControlPage.css";
import { Box, Button, Spinner, Text, Stack } from "@chakra-ui/react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getFirestore, doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

interface WashingmachinePageProps {
  deviceId: string;
}

const Washingmachine: React.FC<WashingmachinePageProps> = ({ deviceId }) => {
  const [timer, setTimer] = useState("00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [activeRPM, setActiveRPM] = useState<string | null>(null);
  const [activeDuration, setActiveDuration] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [power, setPower] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [deviceName, setDeviceName] = useState("");
  const [activeButton, setActiveButton] = useState<"start" | "pause" | "continue" | "end" | null>(null);
  const location = useLocation();

  const modes = ["Cotton", "Fabric", "Polyester"];
  const rpms = ["400 RPM", "800 RPM", "1200 RPM"];
  const durations = ["1hr", "2hr", "3hr"];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);
  
      const unsubscribe = onSnapshot(deviceDocRef, (deviceDocSnap) => {
        if (deviceDocSnap.exists()) {
          const deviceData = deviceDocSnap.data();
          setPower(deviceData.on || false);
          setActiveMode(deviceData.clothType || null);
          setActiveRPM(deviceData.rpm || null);
          setActiveDuration(deviceData.length || null);
          setDeviceName(deviceData.deviceName || "Unnamed Device");
  
          // Sync timer state
          if (deviceData.timerRunning) {
            const startTime = deviceData.timerStartTime?.toDate().getTime() || 0;
            const currentTime = new Date().getTime();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Elapsed time in seconds
            const remainingTime = Math.max(deviceData.timerRemaining - elapsedTime, 0); // Ensure it doesn't go below 0
  
            if (remainingTime > 0) {
              setRemainingTime(remainingTime);
              startTimer(remainingTime); // Start the timer with the updated remaining time
            } else {
              endTimer(); // End the timer if the remaining time is 0
            }
          } else if (deviceData.timerPaused) {
            const remainingTime = deviceData.timerRemaining || 0;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
            setRemainingTime(remainingTime);
            setIsPaused(true);
          } else {
            // If the timer is not running or paused, reset the timer
            setTimer("00:00");
            setRemainingTime(0);
            setIsRunning(false);
            setIsPaused(false);
          }
        } else {
          console.error("Device not found");
        }
        setLoading(false);
      });
  
      return () => {
        unsubscribe();
        if (timerRef.current) {
          clearInterval(timerRef.current); // Clear the interval when the component unmounts
        }
      };
    }
  }, [deviceId]);

  const updatePowerState = async (newPowerState: boolean) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { on: newPowerState });
        setPower(newPowerState);
      } catch (error) {
        console.error("Error updating power state:", error);
      }
    }
  };

  const updateClothType = async (newClothType: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { clothType: newClothType });
        setActiveMode(newClothType);
      } catch (error) {
        console.error("Error updating cloth type:", error);
      }
    }
  };

  const updateRPM = async (newRPM: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { rpm: newRPM });
        setActiveRPM(newRPM);
      } catch (error) {
        console.error("Error updating RPM:", error);
      }
    }
  };

  const updateDuration = async (newDuration: string) => {
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);

      try {
        await updateDoc(deviceDocRef, { length: newDuration });
        setActiveDuration(newDuration);
      } catch (error) {
        console.error("Error updating duration:", error);
      }
    }
  };

  const handleBackButtonClick = () => {
    if (location.state?.fromAllDevices) {
      navigate('/alldevices');
    } else if (roomId) {
      navigate(`/devices/${roomId}`);
    } else {
      navigate('/home');
    }
  };

  const startTimer = async (initialTime?: number) => {
    if (isRunning || !activeDuration) return;
  
    setIsRunning(true);
    setIsPaused(false);
    setActiveButton("start");
  
    const durationInSeconds = initialTime || parseInt(activeDuration) * 3600;
    let time = durationInSeconds;
  
    // Update Firestore
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);
  
      try {
        await updateDoc(deviceDocRef, {
          timerRunning: true,
          timerPaused: false,
          timerRemaining: durationInSeconds,
          timerStartTime: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error updating timer state:", error);
      }
    }
  
    timerRef.current = setInterval(() => {
      time -= 1;
      if (time < 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimer("00:00");
        setActiveButton(null);
        return;
      }
  
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }, 1000);
  };

  const pauseTimer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(true);
    setActiveButton("pause");
  
    // Calculate remaining time from the current timer value
    const [minutes, seconds] = timer.split(":").map(Number);
    const remainingTime = minutes * 60 + seconds;
    setRemainingTime(remainingTime);
  
    // Update Firestore
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);
  
      try {
        await updateDoc(deviceDocRef, {
          timerRunning: false,
          timerPaused: true,
          timerRemaining: remainingTime, // Ensure this is a valid number
        });
      } catch (error) {
        console.error("Error updating timer state:", error);
      }
    }
  };

  const continueTimer = async () => {
    if (isRunning || !remainingTime) return;
  
    setIsRunning(true);
    setIsPaused(false);
    setActiveButton("continue");
  
    // Update Firestore
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);
  
      try {
        await updateDoc(deviceDocRef, {
          timerRunning: true,
          timerPaused: false,
          timerRemaining: remainingTime, // Pass the remaining time
          timerStartTime: serverTimestamp(), // Reset the start time
        });
      } catch (error) {
        console.error("Error updating timer state:", error);
      }
    }
  
    let time = remainingTime;
  
    timerRef.current = setInterval(() => {
      time -= 1;
      if (time < 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimer("00:00");
        setActiveButton(null);
        return;
      }
  
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }, 1000);
  };

  const endTimer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer("00:00");
    setIsRunning(false);
    setIsPaused(false);
    setRemainingTime(0);
    setActiveButton("end");
  
    // Update Firestore
    if (deviceId) {
      const db = getFirestore();
      const deviceDocRef = doc(db, "devices", deviceId);
  
      try {
        await updateDoc(deviceDocRef, {
          timerRunning: false,
          timerPaused: false,
          timerRemaining: 0,
        });
      } catch (error) {
        console.error("Error updating timer state:", error);
      }
    }
  };

  const handleModeChange = (mode: string) => {
    if (isRunning) return;
    updateClothType(mode);
  };

  const handleRPMChange = (rpm: string) => {
    if (isRunning) return;
    updateRPM(rpm);
  };

  const handleDurationChange = (duration: string) => {
    if (isRunning) return;
    updateDuration(duration);
    setTimer(`${duration}:00`);
  };

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
            {deviceName}
          </Text>
          <Text fontSize="lg" color="black" textAlign={'center'}>
            Washing Machine
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
            disabled={isRunning}
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
            disabled={isRunning}
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
            disabled={isRunning}
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
        maxWidth="400px"
        margin="20px auto"
      >
        {/* Start Button */}
        <Button
          flex="1"
          borderRadius="0"
          borderRight="1px solid #ccc"
          bg={activeButton === "start" ? "#6cc358" : "white"}
          color={activeButton === "start" ? "white" : "#6cc358"}
          onClick={() => startTimer()}
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