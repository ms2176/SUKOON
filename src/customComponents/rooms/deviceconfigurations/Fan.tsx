import React, { useState, useRef } from "react";
import "../DeviceControlPage.css"; // Updated styles
import { Box, Button } from "@chakra-ui/react";

const Fan = () => {
  const [timer, setTimer] = useState("00:00"); // Timer display
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is running
  const [activeMode, setActiveMode] = useState<string | null>(null); // Track active mode (Cotton, Fabric, Polyester)
  const [activeRPM, setActiveRPM] = useState<string | null>(null); // Track active RPM (400, 800, 1200)
  const [activeDuration, setActiveDuration] = useState<string | null>(null); // Track active duration (1hr, 2hr, 3hr)
  const [isPaused, setIsPaused] = useState(false); // Track if the timer is paused
  const [power, setPower] = useState(true); // Light power toggle state
  const [remainingTime, setRemainingTime] = useState(0); // Track remaining time when paused

  // Individual states for each button
  const [activeButton, setActiveButton] = useState<"start" | "pause" | "continue" | "end" | null>(null);

  const modes = ["Cotton", "Fabric", "Polyester"];
  const rpms = ["400 RPM", "800 RPM", "1200 RPM"];
  const durations = ["1hr", "2hr", "3hr"];

  // Ref to store the interval ID for the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const togglePower = () => {
    setPower((prev) => !prev);
  };

  // Function to handle mode selection
  const handleModeChange = (mode: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    setActiveMode(mode);
  };

  // Function to handle RPM selection
  const handleRPMChange = (rpm: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    setActiveRPM(rpm);
  };

  // Function to handle duration selection
  const handleDurationChange = (duration: string) => {
    if (isRunning) return; // Prevent changes if the timer is running
    setActiveDuration(duration);
    setTimer(`${duration}:00`); // Update the timer display to the selected duration
  };

  return (
    <div className="ac-control-container">
      {/* Header */}
      <div className="header" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <button className="back-button">←</button>
        <h1>Fan</h1>
        <div className="power-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={power} onChange={togglePower} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      

      {/* RPM Buttons */}
      <div className="modes" style={{ padding: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
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

export default Fan;