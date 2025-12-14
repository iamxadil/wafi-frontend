import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/bottomdashboard.css";

import {
  RiHome2Line as HomeIcon,
  RiUserSearchLine as UsersIcon,
  RiNotification3Line as Notification,
  RiFileListLine as OrdersIcon,
  RiShapesLine as ProductsIcon,
  RiFileAddLine as Approve,
  RiDeviceLine as Device,
  RiArchive2Line as Archive,
} from "react-icons/ri";

import { IoAnalyticsOutline as Analytics } from "react-icons/io5";
import { MdOutlineSecurity as PermissionsIcon } from "react-icons/md";
import { Mail } from "lucide-react";

import useAuthStore from "../../../stores/useAuthStore.jsx";

const MIN_CELL = 44;     // smallest icon cell size
const MAX_COLS = 7;      // dense max
const MIN_COLS = 4;      // tiny screens still ok
const GAP = 6;

const BottomDashboard = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  const dockRef = useRef(null);
  const [cols, setCols] = useState(6);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastScroll.current;

      if (delta > 8 && y > 70) setHidden(true);
      if (delta < -8) setHidden(false);

      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // same logic / links as your SideDashboard
  const items = useMemo(() => {
    const base = [
      { key: "home", to: "/", label: "Home", icon: HomeIcon, always: true },
      { key: "dash", to: "/admin-dashboard", label: "Dashboard", icon: Device, always: true },
      { key: "noti", to: "/admin-dashboard/notifications", label: "Notifications", icon: Notification, always: true },

      { key: "products", to: "/admin-dashboard/products", label: "Products", icon: ProductsIcon, perm: "products" },
      { key: "orders", to: "/admin-dashboard/orders", label: "Orders", icon: OrdersIcon, perm: "orders" },
      { key: "users", to: "/admin-dashboard/users", label: "Users", icon: UsersIcon, perm: "users" },
      { key: "analytics", to: "/admin-dashboard/analytics", label: "Analytics", icon: Analytics, perm: "analytics" },
      { key: "approvals", to: "/admin-dashboard/approvals", label: "Approvals", icon: Approve, perm: "approvals" },
      { key: "archive", to: "/admin-dashboard/archive", label: "Archive", icon: Archive, perm: "archive" },
      { key: "permissions", to: "/admin-dashboard/permissions", label: "Permissions", icon: PermissionsIcon, perm: "permissions" },

      // keep your current logic style for emails (admin OR permissions.permissions)
      { key: "emails", to: "/admin-dashboard/emails", label: "Emails", icon: Mail, perm: "emails" },
    ];

    return base.filter((i) => {
      if (i.always) return true;
      if (i.special) return user?.role === "admin" || user?.permissions?.permissions;
      return user?.role === "admin" || user?.permissions?.[i.perm];
    });
  }, [user]);

  // active route
  const activeKey = useMemo(() => {
    if (location.pathname === "/") return "home";
    const match = items
      .filter((i) => location.pathname.startsWith(i.to))
      .sort((a, b) => b.to.length - a.to.length)[0];
    return match?.key || "dash";
  }, [location.pathname, items]);

  // responsive columns WITHOUT overflow: ResizeObserver
  useEffect(() => {
    if (!dockRef.current) return;

    const el = dockRef.current;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      // compute how many MIN_CELL + GAP units fit
      const nextCols = Math.floor((w + GAP) / (MIN_CELL + GAP));
      const clamped = Math.max(MIN_COLS, Math.min(MAX_COLS, nextCols));
      setCols(clamped);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <AnimatePresence>
      <motion.nav
        className={`iosGlassDock ${hidden ? "isHidden" : ""}`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: hidden ? 130 : 0, opacity: hidden ? 0 : 1 }}
        exit={{ y: 130, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* SVG filter defs (one time) */}
        <IOSGlassSVGDefs />

        <div className="dockShell" ref={dockRef}>
          <ul
            className="dockGrid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(cols, items.length)}, minmax(${MIN_CELL}px, 1fr))`,
              gap: `${GAP}px`,
            }}
          >
            {items.map((it) => (
              <DockItem
                key={it.key}
                to={it.to}
                label={it.label}
                active={it.key === activeKey}
                Icon={it.icon}
              />
            ))}
          </ul>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

const DockItem = ({ to, label, active, Icon }) => {
  const isLucideMail = Icon === Mail;

  return (
    <li className={`dockItem ${active ? "active" : ""}`}>
      <Link to={to} aria-label={label}>
        {/* Active “iOS glass blob” indicator (SVG-driven refraction) */}
        {active && (
          <motion.span
            className="activeBlob"
            layoutId="ios-active-blob"
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
          >
            <svg className="blobSvg" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <radialGradient id="blobFill" cx="30%" cy="25%" r="80%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                  <stop offset="45%" stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.10)" />
                </radialGradient>
                <radialGradient id="blobHighlight" cx="25%" cy="20%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.90)" />
                  <stop offset="55%" stopColor="rgba(255,255,255,0.10)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
                </radialGradient>
              </defs>

              {/* Base glass */}
              <g filter="url(#iosGlassRefraction)">
                <circle cx="50" cy="50" r="42" fill="url(#blobFill)" />
              </g>

              {/* Specular highlight */}
              <circle cx="44" cy="38" r="34" fill="url(#blobHighlight)" opacity="0.65" />

              {/* Crisp rim */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" />
            </svg>
          </motion.span>
        )}

        <motion.span
          className="dockIcon"
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
        >
          {isLucideMail ? <Mail size={18} /> : <Icon />}
        </motion.span>
      </Link>
    </li>
  );
};

const IOSGlassSVGDefs = () => (
  <svg className="iosGlassDefs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      {/* Refraction-style distortion */}
      <filter id="iosGlassRefraction" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
        {/* Fractal noise for displacement (liquid wobble) */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.010"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="12"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />

        {/* Soft blur inside glass */}
        <feGaussianBlur in="displaced" stdDeviation="0.6" result="soft" />

        {/* Slight contrast lift (glass clarity) */}
        <feColorMatrix
          in="soft"
          type="matrix"
          values="
            1.08 0    0    0 0
            0    1.08 0    0 0
            0    0    1.08 0 0
            0    0    0    1 0"
          result="clarified"
        />

        {/* Specular lighting: iOS-like sheen */}
        <feSpecularLighting
          in="noise"
          surfaceScale="2"
          specularConstant="0.7"
          specularExponent="28"
          lightingColor="#ffffff"
          result="spec"
        >
          <fePointLight x="10" y="10" z="45" />
        </feSpecularLighting>
        <feComposite in="spec" in2="clarified" operator="in" result="specIn" />

        {/* Blend lighting with glass */}
        <feBlend in="clarified" in2="specIn" mode="screen" result="lit" />

        {/* Final output */}
        <feComposite in="lit" in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
  </svg>
);

export default BottomDashboard;
