import React, { useState, useEffect, useRef } from "react";
import SearchDropdown from '../components/main/SearchDropdown.jsx';
import "../styles/test.css";

import gesture1 from "/images/gesture.jpg";
import gesture2 from "/images/gesture2.png";
import gesture3 from "/images/gesture3.jpg";
import gesture4 from "/images/gesture4.jpg";

const cards = [
  {
    id: 1,
    title: "Gesture Control",
    img: gesture1,
    text: "Interact with your laptop through natural, responsive hand movements.",
    label: "Gesture",
  },
  {
    id: 2,
    title: "Projection Mode",
    img: gesture2,
    text: "Turn any surface into your personal display — seamless and adaptive.",
    label: "Projection",
  },
  {
    id: 3,
    title: "Precision Focus",
    img: gesture3,
    text: "Ultra-fast sensors for dynamic depth and motion accuracy.",
    label: "Focus",
  },
  {
    id: 4,
    title: "Cinematic Clarity",
    img: gesture4,
    text: "Enjoy crystal visuals with cutting-edge rendering technology.",
    label: "Clarity",
  },
];

const Static = () => {
  const [active, setActive] = useState(1);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = (id) => setActive(id);

  return (
    <section id="feature-section">
      {/* ==== Decorative Blur Spots ==== */}
      <div className="blur-spot spot1"></div>
      <div className="blur-spot spot2"></div>

      {/* ===== Title Section ===== */}
      <div className="feature-header">
        <h2>Experience the Future of Interaction</h2>
        <p>
          Explore the evolution of digital precision — a seamless blend of motion,
          clarity, and immersive response.
        </p>
        <SearchDropdown width={400}/>
      </div>

      {/* ===== Cards Section ===== */}
      <div ref={ref} id="land-container" className={visible ? "visible" : ""}>
        <div className="carousel">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`carousel-card ${active === card.id ? "active" : ""}`}
              onClick={() => handleClick(card.id)}
            >
              <img src={card.img} alt={card.title} />
              <div
                className={`card-content ${
                  active === card.id ? "show-content" : ""
                }`}
              >
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <button>Explore</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Indicator Buttons with Labels ===== */}
      <div className="indicator-bar">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`indicator-btn ${
              active === card.id ? "active-indicator" : ""
            }`}
            onClick={() => handleClick(card.id)}
          >
            <span className="indicator-dot"></span>
            <span className="indicator-text">{card.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Static;
