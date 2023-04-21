import React, { useState, useEffect } from 'react';
import './TypingEffect.css';

const TypingEffect = ({
    text,
    typingSpeed = 100,
    blinkingCursor = true,
    reset = false,
  }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      setDisplayText('');
      setCurrentIndex(0);
    }, [reset]);
  
    useEffect(() => {
      if (currentIndex < text.length) {
        const typingInterval = setInterval(() => {
          setDisplayText((prevDisplayText) => prevDisplayText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, typingSpeed);
  
        return () => clearInterval(typingInterval);
      }
    }, [text, typingSpeed, currentIndex]);
  
    return (
      <span className={`typing-effect ${blinkingCursor ? 'blinking-cursor' : ''}`}>
        {displayText}
      </span>
    );
  };
  

export default TypingEffect;
