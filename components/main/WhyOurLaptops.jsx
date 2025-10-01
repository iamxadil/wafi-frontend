import React, { useState } from "react";
import { FiAward, FiCpu } from "react-icons/fi";
import { BiGift } from "react-icons/bi";
import { FaTrademark } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import "../../styles/whyourlaptops.css";

const WhyOurLaptops = () => {
  const items = [
    {
      icon: <FiAward size={28} />,
      title: "Quality Proven",
      context: "Every laptop is tested to ensure durability, reliability, and long-lasting performance.",
      color: "#9333ea",
    },
    {
      icon: <FiCpu size={28} />,
      title: "High Performance",
      context: "Latest CPUs and GPUs optimized for multitasking, gaming, and professional workloads.",
      color: "#6d28d9",
    },
    {
      icon: <BiGift size={28} />,
      title: "Unlimited Offers",
      context: "Exclusive deals, discounts, and bundles tailored for every type of customer.",
      color: "#c026d3",
    },
    {
      icon: <FaTrademark size={28} />,
      title: "Brand Exclusive",
      context: "Direct partnerships with trusted brands ensure authentic laptops at the best value.",
      color: "#8b5cf6",
    },
  ];

  const [index, setIndex] = useState(0);

  const nextCard = () => setIndex(wrap(0, items.length, index + 1));
  const prevCard = () => setIndex(wrap(0, items.length, index - 1));

  return (
    <section id="why-our-laptops">
      <h2 className="section-header">Why Our Laptops?</h2>

      <div className="stacked-cards-container">
        <AnimatePresence>
          {items.map((item, i) => {
            const pos = i - index;
            if (pos < -1 || pos > 2) return null;

            // slight rotation + randomization
            const rotation = pos * 3 + (Math.random() * 4 - 2);
            const yOffset = pos * 12;
            const scale = pos === 0 ? 1 : 0.95 - pos * 0.01;
            const opacity = 1;
            const zIndex = i === index ? 100 : 100 - Math.abs(i - index);

            return (
              <motion.div
                key={i}
                className="reason-card stacked"
                style={{
                  zIndex,
                  backgroundColor: item.color,
                  boxShadow:
                    pos === 0
                      ? "0 12px 28px rgba(0,0,0,0.35)"
                      : `0 ${4 + pos * 2}px ${8 + pos * 4}px rgba(0,0,0,0.25)`,
                }}
                initial={{ y: yOffset, rotate: rotation, scale, opacity }}
                animate={{ y: yOffset, rotate: rotation, scale, opacity }}
                exit={{ y: -300, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                drag={i === index ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (i === index) {
                    if (info.offset.x > 50) nextCard();
                    else if (info.offset.x < -50) prevCard();
                  }
                }}
              >
                <div className="reason-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.context}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhyOurLaptops;
