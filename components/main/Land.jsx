import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import SearchDropdown from "./SearchDropdown.jsx";
import { useAllProductsQuery } from "../hooks/useAllProductsQuery.jsx";
import useAllProductsStore from "../stores/useAllProductsStore.jsx";
import useTranslate from "../hooks/useTranslate.jsx";
import "../../styles/land.css";
import NewYearHero from '../effects/NewYearHero.jsx';

import { Zap, Gamepad2, Gauge, Music2 } from "lucide-react";

// ✅ Static imports handled by Vite
import gesture1 from "../../assets/img/gesture1.webp";
import gesture2 from "../../assets/img/gesture2.avif";
import gesture3 from "../../assets/img/gesture3.avif";
import gesture4 from "../../assets/img/gesture4.avif";

/* ===========================================================
   1️⃣ Static card data (outside render for memoization)
=========================================================== */
const baseCards = Object.freeze([
  { id: 1, img: gesture1, icon: <Zap size={18} strokeWidth={2.4} />, link: "/laptops" },
  { id: 2, img: gesture2, icon: <Gamepad2 size={18} strokeWidth={2.4} />, link: "/category/Mice" },
  { id: 3, img: gesture3, icon: <Gauge size={18} strokeWidth={2.4} />, link: "/category/Hard Disks & SSDs" },
  { id: 4, img: gesture4, icon: <Music2 size={18} strokeWidth={2.4} />, link: "/category/Headphones" },
]);

/* ===========================================================
   2️⃣ Carousel Card Component (memoized)
=========================================================== */
const CarouselCard = memo(({ card, active, onActivate, onNavigate, t }) => {
  const translations = {
    1: {
      title: t("Best power efficiency", "كفاءة لا مثيل لها"),
      text: t(
        "Ultimate choices that mirrors your aspirations",
        "اختيار مثالي يحاكي طموحك"
      ),
    },
    2: {
      title: t("Pro-Level Control", "تحكُم إحترافي"),
      text: t(
        "Effortless control for exceptional experience",
        "تحكم سهل يجعل المهمة استثنائية"
      ),
    },
    3: {
      title: t("Boosted Performance.", "اداء مُعزز"),
      text: t(
        "Supercharched, highly secured with advanced technology.",
        "سرعة فائقة و امان عالي و تقنية متقدمة"
      ),
    },
    4: {
      title: t("Cinematic Rhythms.", "أنغام سينمائية."),
      text: t(
        "Enjoy with cutting-edge acoustic technology.",
        "استمتع بتقنية صوتية متطورة تمنحك تجربة غامرة."
      ),
    },
  };

  const { title, text } = translations[card.id];

  return (
    <div
      className={`carousel-card ${active === card.id ? "active" : ""}`}
      onClick={() => onActivate(card.id)}
    >
      <img
        src={card.img}
        alt={title}
        fetchpriority={card.id === 1 ? "high" : undefined}
        loading={card.id === 1 ? "eager" : "lazy"}
        width="800"
        height="600"
        decoding="async"
      />

      <div
        className={`card-content ${active === card.id ? "show-content" : ""}`}
        style={{ textAlign: t.textAlign, [t.positionAlign]: 0 }}
      >
        <h3>{title}</h3>
        <p>{text}</p>
        <button
          className={`explore-btn ${!card.link ? "disabled" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (card.link) onNavigate(card.link);
          }}
        >
          {t("Explore", "استكشف")}
        </button>
      </div>
    </div>
  );
});

/* ===========================================================
   3️⃣ Main Landing Component
=========================================================== */
const Land = () => {
  const [active, setActive] = useState(1);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const t = useTranslate();

  /* === Programmatic image preload (runs early) === */
  useEffect(() => {
    // ✅ Create <link rel="preload"> dynamically to fetch hero image ASAP
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = gesture1;
    document.head.appendChild(link);

    // optional: clean up if component unmounts
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  /* === Zustand + React Query === */
  const searchParam = useAllProductsStore((s) => s.searchParam);
  const setSearchParam = useAllProductsStore((s) => s.setSearchParam);
  const { data: searchData } = useAllProductsQuery({
    limit: 10,
    page: 1,
    search: searchParam,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const searchResults = searchData?.products || [];

  /* === Reveal animation === */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  /* === Callbacks === */
  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleActivate = useCallback((id) => setActive(id), []);

  /* === Swipe gestures === */
  const handlers = useSwipeable({
    onSwipedLeft: () => setActive((p) => Math.min(p + 1, baseCards.length)),
    onSwipedRight: () => setActive((p) => Math.max(p - 1, 1)),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section id="feature-section" {...handlers} style={{ alignItems: t.flexAlign }}>
   

      {/* === Hero Header === */}
      <header className="feature-header">
        <h1 style={{ textAlign: t.textAlign }}>
          {t(
            "Al-Wafi for Computers.",
          "الوافي للحاسبات "
          )}
        </h1>
        <p style={{ textAlign: t.textAlign }}>
          {t(
            "Techno–Power that fuels your Ambition — Expertise Guides you to the Ultimate Choice.",
            ".طاقة تقنية تدعم طموحاتك, خبرة تقودك الى الاختيار الافضل"
          )}
        </p>

        <SearchDropdown
          width={720}
          products={searchResults}
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          placeholder={t("Search for products...", "ابحث عن المنتجات...")}
        />
      </header>

      {/* === Carousel === */}
      <div ref={ref} id="land-container" className={visible ? "visible fade-up" : ""}>
        <div className="carousel">
          {baseCards.map((card) => (
            <CarouselCard
              key={card.id}
              card={card}
              active={active}
              onActivate={handleActivate}
              onNavigate={handleNavigate}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* === Indicator Buttons === */}
      <div className="indicator-bar">
        {baseCards.map((card) => (
          <button
            key={card.id}
            className={`indicator-btn ${active === card.id ? "active-indicator" : ""}`}
            onClick={() => setActive(card.id)}
          >
            <span className="indicator-dot"></span>
            <span className="indicator-icon">{card.icon}</span>
            <span className="indicator-text">
              {t(
                { 1: "Power", 2: "Control", 3: "Performance", 4: "Audio" }[card.id],
                { 1: "الطاقة", 2: "التحكم", 3: "الأداء", 4: "الصوت" }[card.id]
              )}
            </span>
          </button>
        ))}
      </div>
    </section>


  );
};

export default memo(Land);
