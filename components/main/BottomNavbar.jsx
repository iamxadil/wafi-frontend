import React, { useEffect, useLayoutEffect, useRef, useState, memo } from "react";
import "../../styles/bottomnavbar.css";
import { House, ShoppingBag, Heart, User, ScrollText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useFavoritesStore from "../stores/useFavoritesStore.jsx";

const LINKS = [
  { to: "/", icon: <House size={20} /> },
  { to: "/cart", icon: <ShoppingBag size={20} /> },
  { to: "/favorites", icon: <Heart size={20} /> },
  { to: "/settings", icon: <User size={20} /> },
  { to: "/my-orders", icon: <ScrollText size={20} /> },
];

function BottomNavbar() {
  const width = useWindowWidth();
  const location = useLocation();
  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const prevCenterX = useRef(0);
  const bubbleId = useRef(0);
  const bubbleLayer = useRef(null);

  const [blob, setBlob] = useState({ x: 0, y: 0, size: 56, sx: 1, sy: 1 });
  const dragging = useRef(false);
  const dragStart = useRef(0);

  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(window.scrollY);

  const cartItems = useCartStore((state) => state.cart);
  const favorites = useFavoritesStore((state) => state.favorites);

  const moveBlobTo = (index, { instant = false } = {}) => {
    const container = containerRef.current;
    const target = linkRefs.current[index];
    if (!container || !target) return;

    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const centerX = tRect.left + tRect.width / 2 - cRect.left;
    const centerY = tRect.top + tRect.height / 2 - cRect.top;
    const size = Math.round(Math.max(44, Math.min(76, tRect.width * 1.6)));
    const left = centerX - size / 2;
    const top = centerY - size / 2;

    const prev = prevCenterX.current || centerX;
    const dx = centerX - prev;
    const dist = Math.abs(dx);
    const stretch = Math.min(1.6, 1 + Math.min(dist / 110, 0.65));
    const squash = Math.max(0.78, 1 - Math.min(dist / 600, 0.22));
    prevCenterX.current = centerX;

    if (instant) {
      setBlob({ x: left, y: top, size, sx: 1, sy: 1 });
    } else {
      setBlob({ x: left, y: top, size, sx: stretch, sy: squash });
      requestAnimationFrame(() =>
        setBlob((b) => ({ ...b, sx: 1, sy: 1 }))
      );
      spawnBubbles(centerX, centerY);
    }
  };

  // 🟢 Bubble animation handled via direct DOM instead of React state
  const spawnBubbles = (x, y) => {
    const layer = bubbleLayer.current;
    if (!layer) return;

    for (let i = 0; i < 3; i++) {
      const size = 4 + Math.random() * 6;
      const bubble = document.createElement("span");
      bubble.className = "bubble";
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubble.style.opacity = 0.5 + Math.random() * 0.4;
      layer.appendChild(bubble);

      const duration = 1200 + Math.random() * 600;
      const phase = Math.random() * Math.PI * 2;

      let start = null;
      const animate = (t) => {
        if (!start) start = t;
        const progress = (t - start) / duration;
        const dx = Math.sin(t / 500 + phase) * 6;
        const dy = Math.sin(t / 700 + phase) * -8 - progress * 40;
        bubble.style.transform = `translate(${dx}px, ${dy}px)`;
        if (progress < 1) requestAnimationFrame(animate);
        else bubble.remove();
      };
      requestAnimationFrame(animate);
    }
  };

  // 🟢 Scroll hide/show throttled
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const delta = scrollY - lastScroll.current;
          lastScroll.current = scrollY;

          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          if (scrollY + windowHeight >= docHeight - 20) setVisible(false);
          else if (delta > 5) setVisible(false);
          else if (delta < -5) setVisible(true);

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🟢 Position blob on route change or resize
  useEffect(() => {
    const idx = LINKS.findIndex((l) => l.to === location.pathname);
    moveBlobTo(idx === -1 ? 0 : idx);
  }, [location.pathname, width]);

  useLayoutEffect(() => {
    const idx = LINKS.findIndex((l) => l.to === location.pathname);
    moveBlobTo(idx === -1 ? 0 : idx, { instant: true });
  }, []);

  if (width >= 1150) return null;

  const blobStyle = {
    width: `${blob.size}px`,
    height: `${blob.size}px`,
    transform: `translate3d(${blob.x}px, ${blob.y}px, 0) scaleX(${blob.sx}) scaleY(${blob.sy})`,
    transition:
      "transform 440ms cubic-bezier(.22,1,.36,1), width 440ms ease, height 440ms ease",
  };

  return (
    <main
      id="bottom-navbar"
      style={{
        transform: `translateX(-50%) ${visible ? "translateY(0)" : "translateY(120%)"}`,
        transition: "transform 360ms ease-out",
      }}
    >
      <svg width="0" height="0">
        <defs>
          <filter id="goo" x="-50%" y="-50%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <ul id="bottom-links" ref={containerRef}>
        <div id="morph-blob" style={blobStyle}>
          <div className="morph-blob-inner" ref={bubbleLayer}></div>
        </div>

        {LINKS.map((link, i) => {
          const count =
            link.to === "/cart"
              ? cartItems.length
              : link.to === "/favorites"
              ? favorites.length
              : 0;

          return (
            <li
              key={link.to}
              ref={(el) => (linkRefs.current[i] = el)}
              className="nav-item"
              onClick={() => moveBlobTo(i)}
            >
              <div className="icon-wrapper">
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  {link.icon}
                </NavLink>
                {count > 0 && <span className="nav-badge pulse">{count}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default memo(BottomNavbar);
