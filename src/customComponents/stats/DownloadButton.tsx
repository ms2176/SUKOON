import React from 'react';
import styled from 'styled-components';

const DownloadButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="Btn" type="button" onClick={onClick}>
        <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
        <span className="icon2" />
        <span className="tooltip">Download</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition-duration: .3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  .svgIcon {
    fill: rgb(124, 206, 88);
    position: relative;
    z-index: 2;
  }

  .icon2 {
    width: 15px;
    height: 4px;
    border-bottom: 2px solid rgb(124, 206, 88);
    border-left: 2px solid rgb(124, 206, 88);
    border-right: 2px solid rgb(124, 206, 88);
    position: relative;
    z-index: 2;
  }

  .tooltip {
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: .2s;
    pointer-events: none;
    white-space: nowrap;
    z-index: 3;
  }

  .tooltip::before {
    position: absolute;
    content: "";
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    transform: rotate(45deg);
    top: -4px;
    left: 50%;
    margin-left: -4px;
  }

  .Btn:hover .tooltip {
    opacity: 1;
    transition-duration: .3s;
  }

  .Btn:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition-duration: .3s;
  }

  .Btn:hover .icon2 {
    border-bottom: 2px solid rgb(108, 206, 88);
    border-left: 2px solid rgb(108, 206, 88);
    border-right: 2px solid rgb(108, 206, 88);
  }

  .Btn:hover .svgIcon {
    fill: rgb(108, 206, 88);
    animation: slide-in-top 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @keyframes slide-in-top {
    0% {
      transform: translateY(-5px);
      opacity: 0.5;
    }

    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

export default DownloadButton;