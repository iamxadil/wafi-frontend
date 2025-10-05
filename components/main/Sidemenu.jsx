import React, { useState } from "react";
import { MdOutlineCloseFullscreen as Close } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/sidemenu.css";

const Sidemenu = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = useState({
    laptops: false,
    accessories: false,
    others: false,
  });

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      laptops: false,
      accessories: false,
      others: false,
      ...(prev[menuName] ? {} : { [menuName]: true }),
    }));
  };

    const navigate = useNavigate();

    const handleNavigation = (path) => {
    navigate(path);   // navigate to the new route
    setIsOpen(false); // close the side menu
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          id="sidemenu-container"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            // Only close if dragged more than 100px to the right
            if (info.offset.x > 500) {
              setIsOpen(false);
            }
          }}
        >
          <div className="close-sidemenu" onClick={() => setIsOpen(false)}>
            <Close size={25} />
          </div>

          <ul>
            <li className="sub-name">
              <Link to="/" onClick={() => setIsOpen(!isOpen)}><button>Home</button></Link>
            </li>

            <li className="sub-name">
              <button onClick={() => toggleMenu("laptops")}>Laptops</button>
              {openMenus.laptops && (
                <ul>
                  <li>Acer</li>
                  <li onClick={() => handleNavigation("/category/laptops/Asus")}>Asus</li>
                  <li onClick={() => handleNavigation("/category/laptops/Apple")}>Apple</li>
                  <li onClick={() => handleNavigation("/category/laptops/Lenovo")}>Lenovo</li>
                  <li onClick={() => handleNavigation("/category/laptops/HP")}>HP</li>
                  <li onClick={() => handleNavigation("/category/laptops/MSI")}>MSI</li>
                  <li onClick={() => handleNavigation("/category/laptops/MSI")}>Dell</li>
                </ul>
              )}
            </li>

            <li className="sub-name">
              <button onClick={() => toggleMenu("accessories")}>Accessories</button>
              {openMenus.accessories && (
                <ul>
                  <li onClick={() => handleNavigation("/category/Keyboards")}>Keyboards</li>
                  <li onClick={() => handleNavigation("/category/Mice")}>Mice</li>
                  <li onClick={() => handleNavigation("/category/Headphones")}>Headphones</li>
                  <li onClick={() => handleNavigation("/category/Joysticks")}>Joysticks</li>
                </ul>
              )}
            </li>

            <li className="sub-name">
              <button onClick={() => toggleMenu("others")}>Others</button>
              {openMenus.others && (
                <ul>
                  <li onClick={() => handleNavigation("/category/Routers")}>Routers</li>
                  <li onClick={() => handleNavigation("/category/Cables")}>Cables</li>
                  <li onClick={() => handleNavigation("/category/Adapters")}>Adapters</li>
                </ul>
              )}
            </li>

            <li className="sub-name">
              <button>Contact Us</button>
            </li>
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Sidemenu;
