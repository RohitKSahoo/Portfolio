import { useState, useEffect } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export const useScramble = (text: string, duration: number = 2000, trigger: boolean = true) => {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    const totalFrames = (duration / 1000) * 60;
    const revealStep = text.length / totalFrames;
    
    setIsAnimating(true);
    
    const interval = setInterval(() => {
      frame++;
      
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * text.length);
      
      const scrambled = text.split('').map((char, i) => {
        if (i < revealCount) return char;
        if (char === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      
      setDisplayText(scrambled);
      
      if (frame >= totalFrames) {
        setDisplayText(text);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [text, duration, trigger]);

  return { displayText, isAnimating };
};
