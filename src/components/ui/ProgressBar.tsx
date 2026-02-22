import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const ProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    setProgress(0);

    // Simulate page load progress
    const steps = [10, 30, 50, 70, 85, 95, 100];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
          setProgress(0);
        }, 300);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [location.pathname]);

  if (!isAnimating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div 
        className="h-full bg-brass-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
      />
    </div>
  );
};
