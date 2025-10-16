// src/components/Sidemenu.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Laptop, Mouse, Router, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/sidemenu.css";

const menuData = [
  {
    title: "Laptops",
    icon: <Laptop size={25} />,
    items: [
      { label: "All Laptops", path: "/laptops" },
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
    title: "Accessories",
    icon: <Mouse size={25} />,
    items: [
      { label: "All Accessories", path: "/accessories" },
      { label: "Headphones", path: "/category/Headphones" },
      { label: "Mice", path: "/category/Mice" },
      { label: "Keyboards", path: "/category/Keyboards" },
    ],
  },
  {
    title: "Networking",
    icon: <Router size={25} />,
    items: [
      { label: "All Components", path: "/others" },
      { label: "Routers", path: "/category/Routers" },
      { label: "Cables", path: "/category/Cables" },
      { label: "Adapters", path: "/category/Adapters" },
    ],
  },
];

const Sidemenu = ({ isOpen, setIsOpen }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
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

          {/* Menu */}
          <motion.nav
            className="sidemenu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sidemenu-close" onClick={() => setIsOpen(false)}>
              <h1>Menu <X size={24} /></h1>
            </div>

            <ul className="sidemenu-list">
              {menuData.map((menu, i) => (
                <li key={i}>
                  <button className="sidemenu-main-btn" onClick={() => toggleSubmenu(i)}>
                    <span className="sidemenu-icon">{menu.icon}</span>
                    <span className="sidemenu-title">{menu.title}</span>
                    <span className="sidemenu-arrow">{openIndex === i ? <ChevronUp /> : <ChevronDown />}</span>
                  </button>

                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.ul
                        className="sidemenu-sublist"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {menu.items.map((item, j) => (
                          <li
                            key={j}
                            className="sidemenu-subitem"
                            onClick={() => handleNavigate(item.path)}
                          >
                            {item.label}
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
