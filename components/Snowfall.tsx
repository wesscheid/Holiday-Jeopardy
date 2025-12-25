import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate static number of snowflakes to avoid re-renders constantly
    setSnowflakes(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((i) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 5 + 5}s`;
        const animationDelay = `${Math.random() * 5}s`;
        const opacity = Math.random() * 0.5 + 0.3;
        const size = Math.random() * 10 + 5;

        return (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-snow"
            style={{
              left,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDuration,
              animationDelay,
              top: '-20px'
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;