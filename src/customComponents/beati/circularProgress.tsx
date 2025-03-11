import React from 'react';
import './circularProgress.css';
import { useNavigate } from 'react-router-dom';

interface CircularProgressBarProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  image?: string;
  onImageClick?: () => void;
  showPercentage?: boolean;
}

const CircularProgressBar = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "#76c7c0",
  image,
  onImageClick,
  showPercentage = false,
}: CircularProgressBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Calculate the size of the image to fit inside the progress bar
  const imageSize = size - strokeWidth * 2;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="progress-ring-circle-background"
          stroke="#e6e6e6" // Light grey background
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress circle */}
        <circle
          className="progress-ring-circle"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.35s ease-out',
          }}
        />

        {/* Rotating text inside the progress bar */}
        {showPercentage && (
          <text
            fill={color}
            fontSize={size * 0.15} // Adjust font size as needed
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <textPath
              xlinkHref="#text-path"
              startOffset="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {progress}%
            </textPath>
          </text>
        )}

        {/* Define the path for the text */}
        <circle
          id="text-path"
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth * 1.5} // Adjust radius to position text inside the progress bar
          fill="transparent"
          stroke="transparent"
        />
      </svg>

      {/* Image inside the progress bar */}
      {image && (
        <div
          className="progress-image"
          onClick={onImageClick}
          style={{
            cursor: 'pointer', // Make it look clickable
            width: imageSize,
            height: imageSize,
            borderRadius: '50%', // Ensure the image is circular
            overflow: 'hidden', // Ensure the image stays within the circle
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            src={image}
            alt="Progress Icon"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Cover the area without distorting the image
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CircularProgressBar;