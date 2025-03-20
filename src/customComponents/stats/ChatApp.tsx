import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Button Component
const Button = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledWrapper>
      <button className="chatBtn" onClick={onClick} aria-label="Open chat">
        <span style={{ fontSize: '26px' }}>💬</span>
        <span className="tooltip">Energy Assistant</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding-bottom: 50px;
  z-index: 900;

  .chatBtn {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid black;
    background-color:rgb(255, 255, 255);
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(76, 125, 62, 0.4);
    position: relative;
    transition: all 0.3s ease;
    transform-origin: center;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(76, 125, 62, 0.5);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .tooltip {
    position: absolute;
    top: -45px;
    right: 0;
    opacity: 0;
    background-color: #4C7D3E;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.3s ease;
    pointer-events: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(10px);
  }

  .tooltip:after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 22px;
    width: 12px;
    height: 12px;
    background-color: #4C7D3E;
    transform: rotate(45deg);
  }

  .chatBtn:hover .tooltip {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Form Component
interface FormProps {
  onClose: () => void;
  onSendMessage: (message: string) => void;
  messages: { text: string; sender: string }[];
  isLoading: boolean;
  loadingStatus: string;
}

const Form = ({ onClose, onSendMessage, messages, isLoading, loadingStatus }: FormProps) => {
  const [inputValue, setInputValue] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
    // Auto-focus the input when the chat opens
    inputRef.current?.focus();
  }, [messages]);

  return (
    <StyledFormWrapper>
      <div className="card">
        <div className="chat-header">
          <div className="header-content">
            <span className="title"> Your Energy Assistant</span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close chat">×</button>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          <ul className="message-list">
            {messages.map((msg, index) => (
              <li key={index} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <span className="bot-icon"></span>}
                {msg.text}
              </li>
            ))}
            {isLoading && (
              <li className="message bot loading">
                <div className="loading-wrapper">
                  <div className="loading-text">{loadingStatus || "Analyzing energy data"}</div>
                  <div className="loading-dots"><span></span><span></span><span></span></div>
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            className="message-input"
            placeholder="Ask about your energy usage..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button className="send-button" onClick={handleSend} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </StyledFormWrapper>
  );
}

const StyledFormWrapper = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

  .card {
    width: 100%;
    background-color: #F5F5F5;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-header {
    background-color: #4C7D3E;
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-wrapper {
    font-size: 20px;
  }

  .title {
    font-size: 16px;
    font-weight: extra-bold;
    font-color: black;
    background-color: #4C7D3E;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .chat-window {
    height: 360px;
    overflow-y: auto;
    padding: 16px;
    background-color:rgb(255, 255, 255);
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
  }

  .message-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message {
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 85%;
    line-height: 1.5;
    font-size: 14px;
    position: relative;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .bot-icon {
    margin-right: 6px;
  }

  .message.user {
    background-color: #4C7D3E;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .message.bot {
    background-color:#6cce58;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    border-left: 3px solid rgb(4, 12, 2);
  }

  .message.loading {
    background-color: white;
    border-left: 3px solid #4C7D3E;
    border-bottom-left-radius: 4px;
  }

  .loading-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .loading-text {
    color: #4C7D3E;
    font-weight: 500;
  }

  .loading-dots {
    display: flex;
    gap: 4px;
    
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #4C7D3E;
      display: inline-block;
      animation: bounce 1.5s infinite ease-in-out;
      
      &:nth-child(1) {
        animation-delay: 0s;
      }
      
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: white;
    border-top: 1px solid #E0E0E0;
  }

  .message-input {
    flex: 1;
    border: 1px solid #E0E0E0;
    border-radius: 24px;
    padding: 12px 16px;
    font-size: 14px;
    color: #333;
    outline: none;
    background-color: white;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: #4C7D3E;
      box-shadow: 0 0 0 2px rgba(76, 125, 62, 0.2);
    }
    
    &::placeholder {
      color: #999;
    }
    
    &:disabled {
      background-color:rgb(255, 255, 255);
      cursor: not-allowed;
    }
  }

  .send-button {
    border: 1px solid rgb(0, 2, 0);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:rgb(255, 255, 255);
    color: rgb(51, 84, 42);
    border-radius: 50%;
    margin-left: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    
    &:hover {
      background-color: #3D6433;
      transform: scale(1.05);
    }
    
    &:disabled {
      background-color:rgb(255, 255, 255);
      cursor: not-allowed;
    }
    
    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    right: 10px;
    left: 10px;
    bottom: 80px;
    width: auto;
    
    .card {
      width: 100%;
    }
  }
`;

// Parent Component
const EnergyAssistantChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  interface LiveEnergyData {
    total_consumption: number;
    unit: string;
    active_devices: number;
    total_devices: number;
  }
  
  const [energyData, setEnergyData] = useState<{
    hubInfo: any;
    dailyData: any;
    rooms: any[];
    roomData: { [key: string]: any };
    roomsEnergyData: { [key: string]: any };
    liveEnergy: LiveEnergyData | null;
    devices: any[];
  }>({
    hubInfo: null,
    dailyData: null,
    rooms: [],
    roomData: {},
    roomsEnergyData: {},
    liveEnergy: null,
    devices: []
  });
  
  const apikey = "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"; // Groq API key
  const hubCode = "GFM4Y"; // Default hub code
  const baseApiUrl = "https://api.sukoonhome.me"; // Base API URL

  // Welcome message when chat opens
  const welcomeMessage = "👋 Hello! I'm your Energy Assistant. I can help you understand your energy usage and provide tips to save energy. What would you like to know about your energy consumption?";

  // Function to handle API request errors
  const handleApiError = (error: unknown, fallbackMessage: string) => {
    console.error(error);
    setMessages(prev => [...prev, { 
      text: fallbackMessage || "I'm having trouble connecting to your energy data. Please try again later.", 
      sender: 'bot' 
    }]);
    setIsLoading(false);
    throw error;
  };

  // Fetch hub's energy data (standard format with simulated values)
  const fetchHubEnergyData = async () => {
    try {
      setLoadingStatus("Fetching energy usage data...");
      const response = await fetch(`${baseApiUrl}/hub/${hubCode}/energy`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hub energy data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve your energy usage data. Please try again later.");
    }
  };

  // Fetch real energy data (only uses real measurements from database)
  const fetchRealEnergyData = async () => {
    try {
      setLoadingStatus("Fetching actual energy measurements...");
      const response = await fetch(`${baseApiUrl}/hub/${hubCode}/real-energy`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch real energy data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve your actual energy measurements. Please try again later.");
    }
  };

  // Fetch live energy consumption data
  const fetchLiveEnergyData = async () => {
    try {
      setLoadingStatus("Fetching real-time energy consumption...");
      const response = await fetch(`${baseApiUrl}/hubs/${hubCode}/live-energy`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch live energy data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve your real-time energy consumption. Please try again later.");
    }
  };

  // Fetch list of devices connected to the hub
  const fetchDevices = async () => {
    try {
      setLoadingStatus("Fetching your connected devices...");
      const response = await fetch(`${baseApiUrl}/devices/${hubCode}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve your connected devices. Please try again later.");
    }
  };

  // Fetch all rooms in the hub
  const fetchRooms = async () => {
    try {
      setLoadingStatus("Fetching your rooms data...");
      const response = await fetch(`${baseApiUrl}/hubs/${hubCode}/rooms`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve your rooms data. Please try again later.");
    }
  };

  // Fetch room-specific energy data
  const fetchRoomEnergyData = async (roomId: any) => {
    try {
      setLoadingStatus(`Fetching energy data for room...`);
      const response = await fetch(`${baseApiUrl}/room/${roomId}/energy`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch room energy data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "I couldn't retrieve room-specific energy data. Please try again later.");
    }
  };

  // Load all relevant energy data
  const loadAllEnergyData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch standard hub energy data (with simulations)
      const hubData = await fetchHubEnergyData();
      
      // Fetch real-time energy consumption
      const liveEnergyData = await fetchLiveEnergyData();
      
      // Fetch all connected devices
      const devicesData = await fetchDevices();
      
      // Fetch all rooms
      const roomsData = await fetchRooms();
      
      // Fetch energy data for each room
      const roomsEnergyData: { [key: string]: any } = {};
      for (const room of roomsData) {
        roomsEnergyData[room.roomId] = await fetchRoomEnergyData(room.roomId);
      }
      
      // Store all data in state
      setEnergyData({
              hubInfo: hubData,
              dailyData: hubData?.energy_data?.daily || null,
              liveEnergy: liveEnergyData,
              devices: devicesData,
              rooms: roomsData,
              roomsEnergyData: roomsEnergyData,
              roomData: energyData.roomData // Include the existing roomData
            });
      
      return {
        hubData,
        liveEnergyData,
        devicesData,
        roomsData,
        roomsEnergyData
      };
    } catch (error) {
      console.error("Error loading energy data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = async () => {
    setIsChatOpen(true);
    setMessages([{ text: welcomeMessage, sender: 'bot' }]);
    
    try {
      setIsLoading(true);
      await loadAllEnergyData();
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setMessages([]);
  };

  const sendMessage = async (message: any) => {
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setIsLoading(true);
    
    try {
      // If we don't have energy data yet, fetch it
      if (!energyData.hubInfo) {
        await loadAllEnergyData();
      }
      
      setLoadingStatus("Analyzing your energy usage...");
      
      // Create comprehensive context from our API data
      const context = {
        hubInfo: energyData.hubInfo,
        liveEnergy: energyData.liveEnergy,
        devices: energyData.devices,
        rooms: energyData.rooms,
        roomData: energyData.roomData
      };
      
      // Send request to Groq
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apikey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for a smart home energy management system. Be concise - use at most 3 lines of text at once. Your primary role is to help users understand and optimize their home's energy usage based on real-time and historical data provided.

Based on the energy data context provided, analyze usage patterns, provide personalized recommendations to reduce costs, explain energy consumption patterns, and suggest energy-saving routines. The data shows energy consumption for different rooms and devices in the user's home.

Present insights that are specific to the user's actual energy usage shown in the data. Highlight potential savings, explain technical concepts in plain language, and prioritize actionable advice. If asked about live usage, reference the live-energy data. If the user asks about specific rooms, use the room-specific energy data.

Use the following data in your responses:
- Current live energy usage: ${context.liveEnergy?.total_consumption || 'Not available'} ${context.liveEnergy?.unit || 'kW'}
- Active devices: ${context.liveEnergy?.active_devices || 'Unknown'} out of ${context.liveEnergy?.total_devices || 'Unknown'}
- Monthly usage: ${context.hubInfo?.energy_data?.monthly?.total_energy || 'Not available'} ${context.hubInfo?.energy_data?.monthly?.unit || 'kWh'}
- Highest energy room: ${Object.entries(context.hubInfo?.energy_data?.monthly?.rooms || {})
  .sort((a, b) => (b[1] as { energy_value: number }).energy_value - (a[1] as { energy_value: number }).energy_value)
  .map(([name, data]) => name)[0] || 'Not available'}

For specific device recommendations, consider that the user has the following device types: ${context.devices?.map(d => d.device_type).join(', ') || 'Unknown'}.`
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
  
      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || 'I could not analyze your energy data at this time.';
      
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { 
        text: "I'm sorry, I encountered an error while processing your request. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we need to refresh energy data (e.g. if data is stale)
  useEffect(() => {
    if (isChatOpen && energyData.hubInfo) {
      const refreshInterval = setInterval(async () => {
        // Only refresh live energy data periodically to avoid too many requests
        try {
          const liveData = await fetchLiveEnergyData();
          setEnergyData(prev => ({
            ...prev,
            liveEnergy: liveData
          }));
        } catch (error) {
          console.error("Failed to refresh live energy data:", error);
        }
      }, 60000); // Refresh every minute
      
      return () => clearInterval(refreshInterval);
    }
  }, [isChatOpen, energyData.hubInfo]);

  return (
    <div>
      <Button onClick={openChat} />
      {isChatOpen && (
        <Form
          onClose={closeChat}
          onSendMessage={sendMessage}
          messages={messages}
          isLoading={isLoading}
          loadingStatus={loadingStatus}
        />
      )}
    </div>
  );
};

export default EnergyAssistantChat;