import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import '../styles/static.css';

const HeroBackground = () => {
  return (
    <section id="hero-background">

      {/* Spline Fullscreen Background */}



      <Spline
        scene="https://prod.spline.design/EGBRToYpLXnlZ-OQ/scene.splinecode" 
          style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'auto', // keep buttons hoverable
          background: 'transparent',
          transform: "translateY(-10%)"
        }}
      />
  
      {/* Glassy Text Overlay */}
      <motion.div
        className="hero-overlay"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <h1>Elegance, Power, Effortless</h1>
        <p>
          Discover a seamless experience where design meets motion. 
          Explore beautifully crafted visuals and intuitive interactions.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroBackground;
