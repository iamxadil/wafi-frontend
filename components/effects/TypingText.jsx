import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingText = ({ texts, typingSpeed = 100, pauseTime = 5000 }) => {
  const [displayed, setDisplayed] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let typingInterval;
    let pauseTimeout;

    const startTyping = () => {
      setDisplayed('');
      i = 0;
      const currentText = texts[textIndex];

      typingInterval = setInterval(() => {
        setDisplayed(currentText.slice(0, i));
        i++;
        if (i > currentText.length) {
          clearInterval(typingInterval);
          pauseTimeout = setTimeout(() => {
            setTextIndex((prev) => (prev + 1) % texts.length);
          }, pauseTime);
        }
      }, typingSpeed);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(pauseTimeout);
    };
  }, [textIndex, texts, typingSpeed, pauseTime]);

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ display: 'inline-block' }}
      >
        |
      </motion.span>
    </motion.h1>
  );
};

export default TypingText;
