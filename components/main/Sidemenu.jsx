import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Laptop,
  Mouse,
  Blend,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Monitor,
  Puzzle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/sidemenu.css";
import useTranslate from "../hooks/useTranslate.jsx";

const menuData = [
  {
    titleKey: { en: "Laptops", ar: "لابتوبات" },
    icon: <Laptop size={25} />,
    type: "dropdown",
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
    type: "dropdown",
    items: [
      { label: { en: "All Accessories", ar: "جميع الإكسسوارات" }, path: "/accessories" },
      { label: "Headphone", path: "/category/Headphones" },
      { label: "Speaker", path: "/category/Speakers" },
      { label: "Bag", path: "/category/Bags" },
      { label: "Mouse", path: "/category/Mice" },
      { label: "Keyboard", path: "/category/Keyboards" },
      { label: "Combo Kb & M", path: "/category/Combo Kb & M" },
      { label: "Cooling Pad", path: "/category/Cooling Pads" },
      { label: "Mousepad & Deskpad", path: "/category/Mousepads & Deskpads" },
    ],
  },

  {
    titleKey: { en: "Components", ar: "مُعدات" },
    icon: <Puzzle size={25} />,
    type: "dropdown",
    items: [
      { label: { en: "All Components", ar: "جميع المعدات" }, path: "/components" },
      { label: "Hard Disks & SSDs", path: "/category/Hard Disks & SSDs" },
      { label: "RAM", path: "/category/RAM" },
    ],
  },

  {
    titleKey: { en: "Monitors", ar: "شاشات" },
    icon: <Monitor size={25} />,
    type: "single",
    path: "/monitors",
  },

  {
    titleKey: { en: "Others", ar: "معدات اخرى" },
    icon: <Blend size={25} />,
    type: "single",
    path: "/others",
  },
];

const Sidemenu = ({ isOpen, setIsOpen }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const t = useTranslate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
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
          {/* Backdrop */}
          <motion.div
            className="sidemenu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.nav
            className="sidemenu-container"
            initial={{
              x: t.language === "ar" ? 260 : -260,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: t.language === "ar" ? 260 : -260,
              opacity: 0,
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            dir={t.language === "ar" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div
              className="sidemenu-close"
              onClick={() => setIsOpen(false)}
              style={{
                flexDirection: t.language === "ar" ? "row-reverse" : "row",
              }}
            >
              <h1>
                {t("Menu", "القائمة")} <X size={24} />
              </h1>
            </div>

            {/* Menu List */}
            <ul className="sidemenu-list">
              {menuData.map((menu, i) => (
                <li key={i}>
                  {/* SINGLE ITEM */}
                  {menu.type === "single" && (
                    <motion.button
                      className="sidemenu-main-btn single"
                      onClick={() => handleNavigate(menu.path)}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="sidemenu-icon">{menu.icon}</span>

                      <span className="sidemenu-title">
                        {t(menu.titleKey.en, menu.titleKey.ar)}
                      </span>
                    </motion.button>
                  )}

                  {/* DROPDOWN */}
                  {menu.type === "dropdown" && (
                    <>
                      <motion.button
                        className="sidemenu-main-btn"
                        onClick={() => toggleSubmenu(i)}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="sidemenu-icon">{menu.icon}</span>

                        <span className="sidemenu-title">
                          {t(menu.titleKey.en, menu.titleKey.ar)}
                        </span>

                        <span className="sidemenu-arrow">
                          {openIndex === i ? <ChevronUp color="var(--accent)"/> : <ChevronDown color="var(--accent)"/>}
                        </span>
                      </motion.button>

                      <AnimatePresence>
                        {openIndex === i && (
                          <motion.ul
                            className="sidemenu-sublist"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ originY: 0 }}
                          >
                            {menu.items.map((item, j) => (
                              <motion.li
                                key={j}
                                className="sidemenu-subitem"
                                onClick={() => handleNavigate(item.path)}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -10, opacity: 0 }}
                                transition={{
                                  duration: 0.18,
                                  delay: j * 0.02,
                                }}
                              >
                                {typeof item.label === "object"
                                  ? t(item.label.en, item.label.ar)
                                  : item.label}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  )}
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
