import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Button Component
const Button = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="chatBtn" onClick={onClick} aria-label="Open chat">
        <span style={{ fontSize: '155%' }}>💡</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 75px;
  right: 20px;
  z-index: 1000;
  background-color: transparent;

  .chatBtn {
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid #4682B4; /* Energy blue */
    cursor: pointer;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.164);
    position: relative;
    background-size: 300%;
    background-position: left;
    transition-duration: 1s;
    background-color: rgb(255, 255, 255);

    /* Add active state styling */
    &:active {
      transform: scale(0.95);
      border: 3px solid #4682B4; /* Thicker border when clicked */
    }
  }

  .chatBtn:hover {
    background-position: right;
    transition-duration: 0.5s;
  }
`;

// Form Component
const Form = ({ onClose, onSendMessage, messages, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <StyledFormWrapper>
      <div className="card">
        <div className="chat-header">
          Energy Assistant
          <button className="close-button" onClick={onClose} aria-label="Close chat">×</button>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          <ul className="message-list">
            {messages.length === 0 && (
              <li className="message bot">
                Hi there! I'm your energy assistant. Ask me about your energy usage, top consumers, or how to save energy.
              </li>
            )}
            {messages.map((msg, index) => (
              <li key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </li>
            ))}
            {isLoading && <li className="message bot">Analyzing your energy data...</li>}
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
          />
          <button className="send-button" onClick={handleSend} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </StyledFormWrapper>
  );
};

const StyledFormWrapper = styled.div`
  position: fixed;
  bottom: 120px;
  right: 20px;
  z-index: 1000;

  .card {
    width: 320px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .chat-header {
    background-color: #4682B4; /* Energy blue */
    color: #fff;
    padding: 12px 15px;
    font-size: 16px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
  }

  .close-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }

  .chat-window {
    height: 300px;
    overflow-y: auto;
    padding: 15px;
  }

  .message-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .message {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    max-width: 85%;
    line-height: 1.4;
  }

  .message.user {
    background-color: #4682B4; /* Energy blue */
    color: white;
    margin-left: auto;
  }

  .message.bot {
    background-color: #f0f7ff; /* Lighter blue for bot */
    color: #333;
    margin-right: auto;
    border: 1px solid #e0eeff;
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-top: 1px solid #e6e6e6;
  }

  .message-input {
    flex: 1;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    outline: none;
    padding: 8px 12px;
    font-size: 14px;
    color: #333;
  }

  .message-input:focus {
    border-color: #4682B4;
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.2);
  }

  .send-button {
    border: none;
    outline: none;
    background-color: #4682B4;
    color: #fff;
    font-size: 14px;
    padding: 8px 15px;
    margin-left: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .send-button:hover {
    background-color: #5993c5;
  }

  .send-button:disabled {
    background-color: #a5c2dc;
    cursor: not-allowed;
  }
`;

// Parent Component
const ChatApp = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [energyData, setEnergyData] = useState(null);
  const apiKey = "fake"; // Replace with your Groq API key in production
  
  // Function to fetch energy data from the API
  const fetchEnergyData = async (hubId) => {
    try {
      const response = await fetch(`https://testing.sukoonhome.me/hub/${hubId}/real-energy`);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching energy data:', error);
      return null;
    }
  };

  // Function to get user's recent energy data
  const getUserEnergyContext = async () => {
    try {
      // Get top hubs data (this would typically come from user authentication)
      const hubsResponse = await fetch(`https://testing.sukoonhome.me/firestore/hubs`);
      const hubsData = await hubsResponse.json();
      
      // Get data for the first hub in the list or use a specific hub ID
      // In a real app, you might want to let users select their hub or detect it from login
      const hubId = hubsData && hubsData.length > 0 ? hubsData[0].hub_id : null;
      
      if (!hubId) return null;
      
      // Fetch energy data for this hub
      const energyData = await fetchEnergyData(hubId);
      
      // Add this data to state for future reference
      setEnergyData(energyData);
      
      return energyData;
    } catch (error) {
      console.error('Error getting energy context:', error);
      return null;
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setMessages([]);
  };

  const sendMessage = async (message) => {
    // Add user message to the chat
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setIsLoading(true);
    
    try {
      // Fetch energy data if we don't already have it
      if (!energyData) {
        await getUserEnergyContext();
      }
      
      // Prepare the context for the AI
      const context = energyData 
        ? JSON.stringify(energyData)
        : "No energy data available at the moment.";
      
      console.log('Sending request to Groq with energy data context');
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for a smart home energy management system. Be concise - at most use 3 lines of text at once. Your primary role is to help users understand and optimize their home's energy usage based on real-time data. 
              
              You will analyze the energy data, provide personalized recommendations to reduce costs, explain energy consumption patterns, troubleshoot issues, and suggest energy-saving routines. Use the data from the additional context to provide accurate, context-specific responses.
              
              Be conversational and focus on practical advice. Highlight potential savings, explain technical concepts in plain language, and respect user privacy. Always prioritize actionable insights and long-term energy efficiency strategies.
              
              Here is the user's current energy data: ${context}`
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || 'I couldn\'t retrieve energy information at the moment. Please try again later.';
      
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message to Groq:', error);
      setMessages((prev) => [...prev, { 
        text: "I'm having trouble connecting to our system. Please try again in a moment.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={openChat} />
      {isChatOpen && (
        <Form
          onClose={closeChat}
          onSendMessage={sendMessage}
          messages={messages}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ChatApp;