import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Sparkles, ArrowRight, Zap, PartyPopper, Trophy, Star } from "lucide-react";
import animationData from "../../assets/json/ny.json";
import fireworksData from "../../assets/json/fireworks.json";
import Lottie from "react-lottie";
import "../../styles/newyearhero.css";
import { motion, AnimatePresence } from "framer-motion";

const NewYearHero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isCelebrationMode, setIsCelebrationMode] = useState(false);

  // Memoized countdown calculation
  const targetDate = useMemo(() => new Date("2026-01-01T00:00:00"), []);

  // Countdown with optimized interval
  useEffect(() => {
    setIsLoading(true);
    const loadTimer = setTimeout(() => setIsLoading(false), 600);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setIsCelebrationMode(true);
        setShowFireworks(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(loadTimer);
    };
  }, [targetDate]);

  // Optimized tick animation using CSS classes only
  useEffect(() => {
    if (isCelebrationMode) return;
    
    const stamps = document.querySelectorAll(".stamp:not(.skeleton)");
    const timer = setTimeout(() => {
      stamps.forEach(stamp => stamp.classList.remove("changing"));
    }, 400);
    
    stamps.forEach(stamp => stamp.classList.add("changing"));
    
    return () => clearTimeout(timer);
  }, [timeLeft.seconds, isCelebrationMode]);

  // Memoized handlers
  const handleFireworks = useCallback(() => {
    setShowFireworks(true);
    const timer = setTimeout(() => setShowFireworks(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const format = useCallback((num) => String(num).padStart(2, "0"), []);

  // Memoized Lottie options
  const defaultOptions = useMemo(() => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }), []);

  const fireworksOptions = useMemo(() => ({
    loop: false,
    autoplay: true,
    animationData: fireworksData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }), []);

  // Memoized progress percentage
  const progressPercentage = useMemo(() => 
    ((365 - timeLeft.days) / 365 * 100).toFixed(1), 
    [timeLeft.days]
  );

  // Memoized formatted time
  const formattedTime = useMemo(() => ({
    days: format(timeLeft.days),
    hours: format(timeLeft.hours),
    minutes: format(timeLeft.minutes),
    seconds: format(timeLeft.seconds),
  }), [timeLeft, format]);

  // Memoized countdown stamps config
  const stampConfig = useMemo(() => [
    { key: 'days', label: 'Days', value: formattedTime.days, className: 'days-stamp' },
    { key: 'hours', label: 'Hours', value: formattedTime.hours, className: 'hours-stamp' },
    { key: 'minutes', label: 'Minutes', value: formattedTime.minutes, className: 'minutes-stamp' },
    { key: 'seconds', label: 'Seconds', value: formattedTime.seconds, className: 'seconds-stamp' },
  ], [formattedTime]);

  return (
    <motion.div
      className="ny-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Fireworks Lottie */}
      <AnimatePresence mode="wait">
        {showFireworks && (
          <motion.div
            key="fireworks"
            className="fireworks-lottie-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Lottie 
              key="fireworks-lottie"
              options={fireworksOptions} 
              isClickToPauseDisabled={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {isCelebrationMode && (
          <motion.div
            key="celebration"
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="celebration-glow" />
            <div className="celebration-particles">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`particle-${i}`} className="celebration-particle" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SECTION */}
      <section className="ny-left">
        <motion.div
          className="ny-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="title-wrapper">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Sparkles size={28} className="title-icon" />
            </motion.div>
            <h1>
              {isCelebrationMode ? (
                <motion.span
                  key="celebration-title"
                  className="celebration-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Happy New Year 2026!
                </motion.span>
              ) : (
                <motion.span
                  key="normal-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  The Shift Awaits
                </motion.span>
              )}
            </h1>
          </div>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isCelebrationMode ? (
              <>
                <Trophy size={16} className="inline-icon" />
                {" "}A new beginning starts now. Embrace the journey ahead with renewed energy and purpose.
              </>
            ) : (
              "2026 builds on what works and improves what matters — delivering a cleaner, more focused experience designed for the way you move forward."
            )}
          </motion.p>
        </motion.div>

        {/* COUNTDOWN / CELEBRATION MESSAGE */}
        <motion.div
          className={`time-stamps ${isCelebrationMode ? 'celebration-display' : ''}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isCelebrationMode ? (
            <motion.div
              className="celebration-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <motion.div
                className="celebration-icon"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", delay: 0.4 }}
              >
                <PartyPopper size={48} />
              </motion.div>
              <motion.h2
                className="celebration-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Welcome to 2026!
              </motion.h2>
              <motion.p
                className="celebration-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                The countdown has ended. The future is here.
              </motion.p>
              <motion.div
                className="achievement-badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="achievement-badge"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star size={20} />
                  <span>New Beginnings</span>
                </motion.div>
                <motion.div
                  className="achievement-badge"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trophy size={20} />
                  <span>Milestone Reached</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : isLoading ? (
            <div className="skeleton-grid">
              {Array.from({ length: 4 }).map((_, idx) => (
                <React.Fragment key={`skeleton-${idx}`}>
                  <div className="stamp-group skeleton-wrapper">
                    <div className="stamp skeleton" />
                    <div className="stamp-label skeleton-label" />
                  </div>
                  {idx < 3 && <div className="stamp-separator">:</div>}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <>
              {stampConfig.map((stamp, index) => (
                <React.Fragment key={stamp.key}>
                  <motion.div
                    className="stamp-group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className={`stamp ${stamp.className}`}>
                      {stamp.value}
                    </div>
                    <span className="stamp-label">{stamp.label}</span>
                  </motion.div>
                  {index < 3 && (
                    <motion.span
                      className="stamp-separator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * index + 0.05 }}
                    >
                      :
                    </motion.span>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </motion.div>

        {/* Progress Bar (only in countdown mode) */}
        {!isCelebrationMode && (
          <motion.div
            className="progress-section"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="progress-header">
              <span>Countdown Progress</span>
              <span className="progress-percentage">
                {progressPercentage}%
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* ACTION BUTTONS */}
        <motion.div
          className="action-buttons"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <a href="/laptops">
          <motion.button
            className="primary-btn"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            
          >
            {isCelebrationMode ? "Explore 2026 Collection" : "Browse"}
            <ArrowRight size={18} />
          </motion.button>
          </a>
       

          {!isCelebrationMode ? (
            <motion.button
              className="secondary-btn"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFireworks}
            >
              <Zap size={18} />
              Trigger Fireworks
            </motion.button>
          ) : (
            <motion.button
              className="celebration-btn"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFireworks(true)}
            >
              <PartyPopper size={18} />
              Celebrate Again
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* RIGHT SECTION */}
      <motion.section
        className="ny-right"
        initial={{ x: 20, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
      >
        <div className="lottie-container">
          <div className="lottie-glow" />
          <Lottie 
            key="main-lottie"
            options={defaultOptions} 
            isClickToPauseDisabled={true}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default NewYearHero;