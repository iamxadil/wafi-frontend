import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
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
  const groupRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const cards = [
    { name: "Asus", icon: <Asus /> },
    { name: "Apple", icon: <Apple /> },
    { name: "Acer", icon: <Acer /> },
    { name: "MSI", icon: <MSI /> },
    { name: "Lenovo", icon: <Lenovo /> },
    { name: "HP", icon: <HP /> },
    { name: "Dell", icon: <Dell /> },
    { name: "Logitech", icon: <Logitech /> },
  ];

  useEffect(() => {
    let rafId;
    const speed = 0.7; // pixels per frame

    const move = () => {
      if (!isHovered && groupRef.current) {
        const width = groupRef.current.scrollWidth / 3; // 3 groups!
        let current = x.get();

        current -= speed;
        if (Math.abs(current) >= width) {
          current = 0; // reset behind seamlessly
        }

        x.set(current);
      }
      rafId = requestAnimationFrame(move);
    };

    move();
    return () => cancelAnimationFrame(rafId);
  }, [x, isHovered]);

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
        <motion.div ref={groupRef} className="brand-carousel" style={{ x }}>
          {[...Array(3)].map((_, gIndex) => (
            <div className="brand-group" key={gIndex}>
              {cards.map((card, i) => (
                <div
                  key={`${card.name}-${gIndex}-${i}`}
                  className="brand-card"
                  onClick={() => navigate(`/category/laptops/${card.name}`)}
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
