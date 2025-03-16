import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Button Component
const Button = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="chatBtn" onClick={onClick} aria-label="Open chat">
        {/* Replace SVG with emoji */}
        <span style={{ fontSize: '24px' }}>💬</span>
        {/* Tooltip */}
        <span className="tooltip">Chat</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  .chatBtn {
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid black; /* Added a visible black border */
    background-color: rgb(255, 255, 255);
    background-image: linear-gradient(147deg, rgb(255, 255, 255), rgb(255, 255, 255), rgb(255, 255, 255));
    cursor: pointer;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.164);
    position: relative;
    background-size: 300%;
    background-position: left;
    transition-duration: 1s;

    svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    /* Add active state styling */
    &:active {
      transform: scale(0.95);
      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
      border: 3px solid black; /* Thicker border when clicked */
    }
  }

  .tooltip {
    position: absolute;
    top: -40px;
    opacity: 0;
    background-color: rgb(255, 255, 255);
    color: black; /* Changed tooltip text color to black */
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: 0.5s;
    pointer-events: none;
    letter-spacing: 0.5px;
  }

  .chatBtn:hover .tooltip {
    opacity: 1;
    transition-duration: 0.5s;
  }

  .chatBtn:hover {
    background-position: right;
    transition-duration: 1s;
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
          Chat
          <button className="close-button" onClick={onClose} aria-label="Close chat">×</button>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          <ul className="message-list">
            {messages.map((msg, index) => (
              <li key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </li>
            ))}
            {isLoading && <li className="message bot">Thinking...</li>}
          </ul>
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            className="message-input"
            placeholder="Type your message here"
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
}

const StyledFormWrapper = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 1000;

  .card {
    width: 260px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .chat-header {
    background-color: #333;
    color: #fff;
    padding: 10px;
    font-size: 18px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .close-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }

  .chat-window {
    height: 220px;
    overflow-y: scroll;
    padding: 10px;
  }

  .message-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .message {
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 5px;
    max-width: 80%;
  }

  .message.user {
    background-color: #007bff;
    color: white;
    margin-left: auto;
  }

  .message.bot {
    background-color: #f1f1f1;
    color: #333;
    margin-right: auto;
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ccc;
  }

  .message-input {
    flex: 1;
    border: 1px solid #ccc;
    outline: none;
    padding: 5px;
    font-size: 14px;
    color: #333; /* Changed input text color to dark */
  }

  .send-button {
    border: none;
    outline: none;
    background-color: #333;
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
    cursor: pointer;
  }

  .send-button:hover {
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }
`;

// Parent Component
const ChatApp = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apikey = "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";

  const openChat = () => {
    setIsChatOpen(true);
    // Reset messages to start a new chat when opening
    setMessages([]);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    // Reset messages when closing the chat
    setMessages([]);
  };

  const sendMessage = async (message) => {
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setIsLoading(true);
  
    console.log('Starting API request to Groq');
    
    try {
      console.log('Sending request to Groq with payload:', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      });
  
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
              content: 'You are an AI assistant for a smart home energy management system helping users optimize energy usage, reduce costs, and create a sustainable living environment by providing real-time consumption data, personalized energy-saving tips based on usage patterns, explaining billing details, troubleshooting device connectivity, scheduling energy-saving routines, alerting unusual consumption, providing educational content, assisting with device setup, comparing usage with historical data, and recommending optimal times for high-energy activities while being conversational yet concise, accurate with energy data, recognizing urgency, using plain language for technical concepts, addressing users by name when known, offering immediate solutions and long-term recommendations, respecting privacy and data security, acknowledging information needs, focusing on practical advice, highlighting potential savings, connecting with APIs for device controls, explaining limitations when necessary, and maintaining an encouraging tone without judgment. Dont use bold or italic text. Use short answers and be concise.',
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
  
      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries([...response.headers]));
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error('Parsed error data:', errorData);
          throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        } catch (parseError) {
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      const botResponse = data.choices[0]?.message?.content || 'No response from the bot.';
      console.log('Bot response content:', botResponse);
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message to Groq:', error);
      console.error('Error stack:', error.stack);
      setMessages((prev) => [...prev, { text: `Error: ${error.message}`, sender: 'bot' }]);
    } finally {
      console.log('API request completed');
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