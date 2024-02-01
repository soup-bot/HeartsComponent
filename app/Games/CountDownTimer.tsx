import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  timeRemainingInSeconds: number;
}

export default function CountdownTimer({
  timeRemainingInSeconds,
}: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    timeRemainingInSeconds
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prevSeconds) => Math.max(0, prevSeconds - 1));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return remainingSeconds > 0 ? <p>{formatTime(remainingSeconds)}</p> : null;
}
