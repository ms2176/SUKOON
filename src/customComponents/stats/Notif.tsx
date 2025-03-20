import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Standalone AC Notification Component
const ACNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show notification after 2 minutes (120000 ms)
    // 5 mins = 300000 ms
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300000); // 3 seconds for demo purposes

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Animation duration
  };

  const handleButtonClick = () => {
    console.log('Manage devices clicked');
    navigate('/alldevices');
    handleClose(); // Close the notification after navigating
  };

  if (!isVisible) return null;

  return (
    <StyledNotificationWrapper className={isClosing ? 'closing' : ''}>
      <div className="notification-content">
        <div className="icon-wrapper">
          <span role="img" aria-label="AC">❄️</span>
        </div>
        <div className="message-wrapper">
          <h4>Energy Alert</h4>
          <p>Your AC has been running overnight. Please consider switching it off for better energy consumption.</p>
        </div>
        <button className="close-button" onClick={handleClose} aria-label="Close notification">×</button>
      </div>
      <button className="action-button" onClick={handleButtonClick}>
        Turn Off AC
      </button>
    </StyledNotificationWrapper>
  );
};

const StyledNotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 340px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  z-index: 1100;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  animation: slideIn 0.3s ease-out;
  border-left: 4px solid #4C7D3E;
  
  &.closing {
    animation: slideOut 0.3s ease-in forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(30px);
    }
  }

  .notification-content {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    position: relative;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
    background-color: rgba(76, 125, 62, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .message-wrapper {
    flex: 1;
    padding-right: 20px;
  }

  h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #555;
    font-size: 14px;
    line-height: 1.4;
  }

  .action-button {
    display: block;
    width: 100%;
    background-color: #4C7D3E;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #3D6433;
    }
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    color: #999;
    font-size: 20px;
    cursor: pointer;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: #666;
    }
  }

  @media (max-width: 480px) {
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
  }
`;

export default ACNotification;