import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import SearchDropdown from "./SearchDropdown.jsx";
import { useAllProductsQuery } from "../hooks/useAllProductsQuery.jsx";
import useAllProductsStore from "../stores/useAllProductsStore.jsx";
import "../../styles/land.css";

import gesture1 from "../../assets/img/gesture1.webp";
import gesture2 from "../../assets/img/gesture2.webp";
import gesture3 from "../../assets/img/gesture3.webp";
import gesture4 from "../../assets/img/gesture4.webp";

import { Zap, Gamepad2, Gauge, Music2 } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Ultra thin, Maximum efficiency.",
    img: gesture1,
    text: "Interact with your laptop through natural, responsive hand movements.",
    label: "Power",
    icon: <Zap size={18} strokeWidth={2.4} />,
    link: "/laptops",
  },
  {
    id: 2,
    title: "Gaming Mode.",
    img: gesture2,
    text: "Turn any surface into your personal display — seamless and adaptive.",
    label: "Sense",
    icon: <Gamepad2 size={18} strokeWidth={2.4} />,
    link: "/category/Mice",
  },
  {
    id: 3,
    title: "Boosted Performance.",
    img: gesture3,
    text: "Ultra-fast sensors for dynamic depth and motion accuracy.",
    label: "Performance",
    icon: <Gauge size={18} strokeWidth={2.4} />,
    link: null,
  },
  {
    id: 4,
    title: "Cinematic Rhythms.",
    img: gesture4,
    text: "Enjoy with cutting-edge acoustic technology.",
    label: "Audio",
    icon: <Music2 size={18} strokeWidth={2.4} />,
    link: "/category/Headphones",
  },
];

/* Memoized card to avoid unnecessary re-renders */
const CarouselCard = memo(({ card, active, onActivate, onNavigate }) => (
  <div
    className={`carousel-card ${active === card.id ? "active" : ""}`}
    onClick={() => onActivate(card.id)}
  >
    <img src={card.img} alt={card.title} loading="lazy" decoding="async" />
    <div className={`card-content ${active === card.id ? "show-content" : ""}`}>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      {card.link ? (
        <button
          className="explore-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(card.link);
          }}
        >
          Explore
        </button>
      ) : (
        <button className="explore-btn disabled">Explore</button>
      )}
    </div>
  </div>
));

const Land = () => {
  const [active, setActive] = useState(1);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const searchParam = useAllProductsStore((s) => s.searchParam);
  const setSearchParam = useAllProductsStore((s) => s.setSearchParam);
  const { data: searchData } = useAllProductsQuery({
    limit: 5,
    page: 1,
    search: searchParam,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const searchResults = searchData?.products || [];

  // Reveal animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleActivate = useCallback((id) => setActive(id), []);

  // ✅ swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setActive((p) => (p < cards.length ? p + 1 : p)),
    onSwipedRight: () =>
      setActive((p) => (p > 1 ? p - 1 : p)),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section id="feature-section" {...handlers}>
      <div className="blur-spot spot1"></div>
      <div className="blur-spot spot2"></div>

      <div className="feature-header">
        <h2>Experience the Future of Interaction</h2>
        <p>
          Explore the evolution of digital precision — a seamless blend of motion,
          clarity, and immersive response.
        </p>
        <SearchDropdown
          width={720}
          products={searchResults}
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
      </div>

      <div ref={ref} id="land-container" className={visible ? "visible" : ""}>
        <div className="carousel">
          {cards.map((card) => (
            <CarouselCard
              key={card.id}
              card={card}
              active={active}
              onActivate={handleActivate}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>

      <div className="indicator-bar">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`indicator-btn ${
              active === card.id ? "active-indicator" : ""
            }`}
            onClick={() => setActive(card.id)}
          >
            <span className="indicator-dot"></span>
            <span className="indicator-icon">{card.icon}</span>
            <span className="indicator-text">{card.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default memo(Land);
