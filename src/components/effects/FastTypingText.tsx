import React, { useState, useEffect } from 'react';

export interface FastTypingTextProps {
  text: string;
  delay?: number;
  speed?: number;
  charsPerTick?: number;
  className?: string;
  cursorColor?: string;
  onComplete?: () => void;
}

export const FastTypingText: React.FC<FastTypingTextProps> = ({
  text,
  delay = 120,
  speed = 10,
  charsPerTick = 2,
  className = '',
  cursorColor = '#ef4444',
  onComplete
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsTypingDone(false);

    let intervalId: any = null;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayedLength((prev) => {
          const next = prev + charsPerTick;
          if (next >= text.length) {
            clearInterval(intervalId);
            setIsTypingDone(true);
            onComplete?.();
            return text.length;
          }
          return next;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed, charsPerTick, onComplete]);

  return (
    <span className={`inline-grid ${className}`}>
      {/* Invisible full text: reserves the EXACT final height and width of the block from frame 0 so the container never jitters or changes shape while typing */}
      <span className="invisible pointer-events-none select-none col-start-1 row-start-1" aria-hidden="true">
        {text}
      </span>
      {/* Visible typing text: rendered directly on top in the exact same grid space */}
      <span className="col-start-1 row-start-1">
        {text.slice(0, displayedLength)}
        {!isTypingDone && (
          <span 
            className="inline-block w-[2.5px] h-[1em] ml-0.5 align-middle animate-pulse rounded-[1px]"
            style={{ backgroundColor: cursorColor }}
          />
        )}
      </span>
    </span>
  );
};

export default FastTypingText;
