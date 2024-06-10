import React, { useState, useEffect, useRef } from 'react';

const CounterComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(10); // in seconds
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        setRemainingTime(10);
        setCount(prevCount => prevCount + 1);
      }, remainingTime * 1000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isPaused, remainingTime,count]);

  const handlePause = () => {
    if(isPaused)return;
    if (timeoutRef.current && startTimeRef.current) {
      clearTimeout(timeoutRef.current);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setRemainingTime(prevTime => prevTime - elapsed);
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  return (
    <div>
      <p>Counter: {count}</p>
      <p>Remaining Time: {remainingTime.toFixed(1)}s</p>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleResume}>Resume</button>
    </div>
  );
};

export default CounterComponent;
