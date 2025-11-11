import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Laptop, Mouse, Router, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/sidemenu.css";
import useTranslate from "../hooks/useTranslate.jsx";

const menuData = [
  {
    titleKey: { en: "Laptops", ar: "لابتوبات" },
    icon: <Laptop size={25} />,
    items: [
      { label: { en: "All Laptops", ar: "جميع اللابتوبات" }, path: "/laptops" },
      { label: "Acer", path: "/category/laptops/Acer" },
      { label: "Asus", path: "/category/laptops/Asus" },
      { label: "Apple", path: "/category/laptops/Apple" },
      { label: "MSI", path: "/category/laptops/MSI" },
      { label: "Dell", path: "/category/laptops/Dell" },
      { label: "HP", path: "/category/laptops/HP" },
      { label: "Lenovo", path: "/category/laptops/Lenovo" },
    ],
  },
  {
    titleKey: { en: "Accessories", ar: "إكسسوارات" },
    icon: <Mouse size={25} />,
    items: [
      { label: { en: "All Accessories", ar: "جميع الإكسسوارات" }, path: "/accessories" },
      { label: "Headphones", path: "/category/Headphones" },
      { label: "Speakers", path: "/category/Speakers" },
      { label: "Mice", path: "/category/Mice" },
      { label: "Keyboards", path: "/category/Keyboards" },
      { label: "Combo Kb & M", path: "/category/Combo Kb & M" },
      { label: "Cooling Pads", path: "/category/Cooling Pads" },
      { label: "Mousepads & Deskpads", path: "/category/Mousepads & Deskpads" },
    ],
  },
  {
    titleKey: { en: "Networking", ar: "الشبكات" },
    icon: <Router size={25} />,
    items: [
      { label: { en: "All Components", ar: "جميع المكونات" }, path: "/others" },
      { label: "Routers", path: "/category/Routers" },
      { label: "Cables", path: "/category/Cables" },
      { label: "Adapters", path: "/category/Adapters" },
      { label: "Flash Drives", path: "/category/Flash Drives" },
      { label: "Hard Disks & SSDs", path: "/category/Hard Disks & SSDs" },
    ],
  },
];

const Sidemenu = ({ isOpen, setIsOpen }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const t = useTranslate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleSubmenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* === Backdrop === */}
          <motion.div
            className="sidemenu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* === Menu Container === */}
          <motion.nav
            className="sidemenu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            dir={t.language === "ar" ? "rtl" : "ltr"}
          >
            {/* === Header === */}
            <div
              className="sidemenu-close"
              onClick={() => setIsOpen(false)}
              style={{
                flexDirection: t.language === "ar" ? "row-reverse" : "row",
                textAlign: t.language === "ar" ? "right" : "left",
              }}
            >
              <h1>
                {t("Menu", "القائمة")} <X size={24} />
              </h1>
            </div>

            {/* === Menu List === */}
            <ul className="sidemenu-list">
              {menuData.map((menu, i) => (
                <li key={i}>
                  <button
                    className="sidemenu-main-btn"
                    onClick={() => toggleSubmenu(i)}
                    style={{
                      flexDirection: t.language === "ar" ? "row-reverse" : "row",
                    }}
                  >
                    <span className="sidemenu-icon">{menu.icon}</span>
                    <span className="sidemenu-title">
                      {t(menu.titleKey.en, menu.titleKey.ar)}
                    </span>
                    <span className="sidemenu-arrow">
                      {openIndex === i ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {/* === Submenu === */}
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.ul
                        className="sidemenu-sublist"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          direction: t.language === "ar" ? "rtl" : "ltr",
                          textAlign: t.language === "ar" ? "right" : "left",
                        }}
                      >
                        {menu.items.map((item, j) => (
                          <li
                            key={j}
                            className="sidemenu-subitem"
                            onClick={() => handleNavigate(item.path)}
                          >
                            {typeof item.label === "object"
                              ? t(item.label.en, item.label.ar)
                              : item.label}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Sidemenu;
