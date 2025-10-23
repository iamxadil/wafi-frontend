import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import "../../styles/brandcards.css";
import {
  SiAsus as Asus,
  SiApple as Apple,
  SiAcer as Acer,
  SiMsibusiness as MSI,
  SiLenovo as Lenovo,
  SiHp as HP,
  SiDell as Dell,
  SiLogitechg as Logitech,
} from "react-icons/si";
import { useNavigate } from "react-router-dom";

const BrandCards = () => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const velocity = useRef(0);
  const groupRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [controls, setControls] = useState(null);

  const cards = [
    { name: "Asus", icon: <Asus /> },
    { name: "Apple", icon: <Apple /> },
    { name: "Acer", icon: <Acer /> },
    { name: "MSI", icon: <MSI /> },
    { name: "Lenovo", icon: <Lenovo /> },
    { name: "HP", icon: <HP /> },
    { name: "Dell", icon: <Dell /> },
  ];

  // === Infinite scroll ===
  useEffect(() => {
    let rafId;
    const speed = 0.7; // pixels per frame

    const move = () => {
      if (!isHovered && !isDragging && groupRef.current) {
        const width = groupRef.current.scrollWidth / 3;
        let current = x.get();

        current -= speed;
        if (Math.abs(current) >= width) {
          current = 0;
        }

        x.set(current);
      }
      rafId = requestAnimationFrame(move);
    };

    move();
    return () => cancelAnimationFrame(rafId);
  }, [x, isHovered, isDragging]);

  // === Continue motion after flick ===
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    velocity.current = info.velocity.x;

    const decay = animate(x, x.get() + velocity.current * 0.5, {
      type: "inertia",
      power: 0.8,
      timeConstant: 200,
      modifyTarget: (target) => target % (groupRef.current.scrollWidth / 3),
      onUpdate: (v) => {
        if (groupRef.current) {
          const width = groupRef.current.scrollWidth / 3;
          if (Math.abs(v) >= width) x.set(v % width);
        }
      },
    });

    setControls(decay);
  };

  return (
    <main id="brand-cards-container">
      <header className="brand-header">
        <h1>Our Brands</h1>
        <p>Explore the pioneers of innovation and performance.</p>
      </header>

      <div
        className="carousel-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          ref={groupRef}
          className="brand-carousel"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          onDragStart={() => {
            setIsDragging(true);
            if (controls) controls.stop();
          }}
          onDragEnd={handleDragEnd}
          dragElastic={0.12}
          dragTransition={{ bounceStiffness: 80, bounceDamping: 20 }}
        >
          {[...Array(3)].map((_, gIndex) => (
            <div className="brand-group" key={gIndex}>
              {cards.map((card, i) => (
                <div
                  key={`${card.name}-${gIndex}-${i}`}
                  className="brand-card"
                  onClick={() =>
                    !isDragging && navigate(`/category/laptops/${card.name}`)
                  }
                >
                  <div className="icon">{card.icon}</div>
                  <h2>{card.name}</h2>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default BrandCards;
