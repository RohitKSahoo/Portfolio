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
    <span className={className}>
      {text.slice(0, displayedLength)}
      {!isTypingDone && (
        <span 
          className="inline-block w-[2.5px] h-[1em] ml-0.5 align-middle animate-pulse rounded-[1px]"
          style={{ backgroundColor: cursorColor }}
        />
      )}
    </span>
  );
};

export default FastTypingText;
