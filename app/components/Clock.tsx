'use client'

import React, { useState, useEffect } from 'react';

interface ClockProps {
  datediff: number;
}

const Clock: React.FC<ClockProps> = ({ datediff }) => {
  const [time, setTime] = useState({
    hours: '',
    minutes: '',
    seconds: ''
  });

  useEffect(() => {
    const clockInterval = setInterval(handleDate, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const handleDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + datediff);
    const hours = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());
    setTime({ hours, minutes, seconds });
  };

  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : time.toString();
  };

  const { hours, minutes, seconds } = time;
  const secondsStyle = {
    transform: `rotate(${Number(seconds) * 6}deg)`
  };
  const minutesStyle = {
    transform: `rotate(${Number(minutes) * 6}deg)`
  };
  const hoursStyle = {
    transform: `rotate(${Number(hours) * 30}deg)`
  };

  return (
    <div className="clock">
      <div className="analog-clock">
        <div className="dial seconds" style={secondsStyle} />
        <div className="dial minutes" style={minutesStyle} />
        <div className="dial hours" style={hoursStyle} />
      </div>
      <div className="digital-clock">
        {hours}:{minutes}:{seconds}
      </div>
    </div>
  );
};

export default Clock;
