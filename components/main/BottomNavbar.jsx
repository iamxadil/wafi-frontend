import React, { useEffect, useState, memo } from "react";
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
  const [visible, setVisible] = useState(true);
  const lastScroll = React.useRef(window.scrollY);

  const cartItems = useCartStore((state) => state.cart);
  const favorites = useFavoritesStore((state) => state.favorites);

  // 🟢 Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const delta = scrollY - lastScroll.current;
          lastScroll.current = scrollY;

          if (delta > 5) setVisible(false);
          else if (delta < -5) setVisible(true);

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (width >= 1150) return null;

  return (
    <main
      id="bottom-navbar"
      style={{
        transform: `translateX(-50%) ${visible ? "translateY(0)" : "translateY(120%)"}`,
        transition: "transform 360ms ease-out",
      }}
    >
      <ul id="bottom-links">
        {LINKS.map((link) => {
          const count =
            link.to === "/cart"
              ? cartItems.length
              : link.to === "/favorites"
              ? favorites.length
              : 0;

          return (
            <li key={link.to} className="nav-item">
              <div className="icon-wrapper">
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                >
                  {link.icon}
                </NavLink>
                {count > 0 && <span className="nav-badge">{count}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default memo(BottomNavbar);
