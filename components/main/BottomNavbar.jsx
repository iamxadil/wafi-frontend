// src/components/BottomNavbar.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

export default function BottomNavbar() {
  const width = useWindowWidth();
  const location = useLocation();
  const containerRef = useRef(null);
  const linkRefs = useRef([]);
  const prevCenterX = useRef(0);
  const bubbleId = useRef(0);

  const [blob, setBlob] = useState({ x: 0, y: 0, size: 56, sx: 1, sy: 1 });
  const [bubbles, setBubbles] = useState([]);
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

    if (instant) setBlob({ x: left, y: top, size, sx: 1, sy: 1 });
    else {
      setBlob({ x: left, y: top, size, sx: stretch, sy: squash });
      setTimeout(() => setBlob((b) => ({ ...b, sx: 1, sy: 1 })), 400);
      spawnBubbles(centerX, centerY);
    }
  };

  const spawnBubbles = (x, y) => {
    const newBubbles = Array.from({ length: 3 }).map(() => ({
      id: bubbleId.current++,
      x,
      y,
      size: 4 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      lifetime: 1200 + Math.random() * 600,
      offsetX: 0,
      offsetY: 0,
    }));
    setBubbles((prev) => [...prev, ...newBubbles]);
    newBubbles.forEach((b) =>
      setTimeout(() => setBubbles((prev) => prev.filter((p) => p.id !== b.id)), b.lifetime)
    );
  };

  useEffect(() => {
    let frame;
    const animate = () => {
      setBubbles((prev) =>
        prev.map((b) => ({
          ...b,
          offsetX: Math.sin(Date.now() / 500 + b.phase) * 6,
          offsetY: Math.sin(Date.now() / 700 + b.phase) * -8,
        }))
      );
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerDown = (e) => {
    dragging.current = true;
    dragStart.current = e.clientX;
  };
  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const deltaX = e.clientX - dragStart.current;
    setBlob((b) => ({ ...b, x: b.x + deltaX }));
    dragStart.current = e.clientX;
  };
  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    let closestIndex = 0;
    let minDist = Infinity;
    linkRefs.current.forEach((link, idx) => {
      const tRect = link.getBoundingClientRect();
      const centerX = tRect.left + tRect.width / 2 - cRect.left;
      const dist = Math.abs(blob.x + blob.size / 2 - centerX);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = idx;
      }
    });
    moveBlobTo(closestIndex);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScroll.current;
      lastScroll.current = scrollY;

      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 20) setVisible(false);
      else if (delta > 5) setVisible(false);
      else if (delta < -5) setVisible(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    transition: dragging.current
      ? "none"
      : "transform 440ms cubic-bezier(.22,1,.36,1), width 440ms ease, height 440ms ease",
    cursor: "grab",
  };

  return (
    <main
      id="bottom-navbar"
      style={{
        transform: `translateX(-50%) ${visible ? "translateY(0)" : "translateY(120%)"}`,
        transition: "transform 360ms ease-out",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg width="0" height="0">
        <defs>
       <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        </defs>
      </svg>

      <ul id="bottom-links" ref={containerRef}>
     <div id="morph-blob" style={blobStyle}>
      <div className="morph-blob-inner">
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              transform: `translate3d(${b.x - blob.x + b.offsetX}px, ${b.y - blob.y + b.offsetY}px, 0)`,
              opacity: 0.6 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>
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
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
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
