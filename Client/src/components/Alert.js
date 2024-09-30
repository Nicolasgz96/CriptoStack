import React, { useState, useEffect, useCallback } from 'react';

// Alert component that displays a message with a progress bar
const Alert = ({ message, type, onClose }) => {
  // State variables
  const [isVisible, setIsVisible] = useState(false); // Controls the visibility of the alert
  const [isRemoving, setIsRemoving] = useState(false); // Indicates if the alert is being removed
  const [progress, setProgress] = useState(100); // Tracks the progress of the alert (100% to 0%)

  // Function to close the alert
  const closeAlert = useCallback(() => {
    setIsRemoving(true); // Start the removing process
    setIsVisible(false); // Hide the alert
    setTimeout(() => {
      onClose(); // Call the onClose function passed from the parent after a delay
    }, 500); // Wait 500ms before calling onClose to allow for animation
  }, [onClose]);

  // Effect to handle the alert's lifecycle
  useEffect(() => {
    // Show the alert after a short delay
    setTimeout(() => setIsVisible(true), 100);

    // Set a timer to automatically close the alert after 5 seconds
    const timer = setTimeout(() => {
      closeAlert();
    }, 5000);

    // Set up an interval to update the progress bar
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevProgress - 2; // Decrease progress by 2% every 100ms
      });
    }, 100);

    // Cleanup function to clear timers when component unmounts
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [closeAlert]);

  // Determine the background color based on the alert type
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  // Render the alert component
  return (
    <div
      className={`fixed top-4 right-4 w-64 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        transitionProperty: 'transform, opacity',
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}
    >
      {/* Alert header */}
      <div className={`${bgColor} text-white px-4 py-2 flex justify-between items-center`}>
        <span>{type === 'error' ? 'Error' : 'Success'}</span>
        <button onClick={closeAlert} className="text-white hover:text-gray-200">
          &times;
        </button>
      </div>
      {/* Alert message */}
      <div className="px-4 py-2">{message}</div>
      {/* Progress bar */}
      <div className="bg-gray-200 h-1">
        <div
          className={`${bgColor} h-1 transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Alert;