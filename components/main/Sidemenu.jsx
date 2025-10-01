import React, { useState } from "react";
import {
  IoHomeOutline as HomeIcon,
  IoMenu as Hamburger,
  IoLaptopOutline as LaptopIcon,
  IoGameControllerOutline as JoystickIcon,
  IoShapesOutline as OthersIcon,
  IoPhonePortraitOutline as PhoneIcon,
  IoClose as Close
} from "react-icons/io5";
import "../../styles/sidemenu.css";
import { Link } from "react-router-dom";

const Sidemenu = ({setSideMenu, isSideMenu}) => {
  const [openMenus, setOpenMenus] = useState({
    laptops: false,
    accessories: false,
    others: false,
  });

  const toggleMenu = (menuName, event) => {
    event.preventDefault();

    setOpenMenus((prev) => {
      const isCurrentlyOpen = prev[menuName];
      return {
        laptops: false,
        accessories: false,
        others: false,
        ...(isCurrentlyOpen ? {} : { [menuName]: true }),
      };
    });
  };

  return (
    <>
      <nav id="sidemenu-container">

        <div className="close-icon"><Close onClick={() => setSideMenu(!isSideMenu)}/></div>

        <ul id="sidemenu">
          <li>
            <Link to="/">
              <HomeIcon /> Home
            </Link>
          </li>

          <li>
            <Link to="/" onClick={(e) => toggleMenu("laptops", e)}>
              <LaptopIcon /> Laptops
            </Link>

            {openMenus.laptops && (
              <ul className={`side-submenu ${openMenus.laptops ? "open" : ""}`}>
                <li>Asus</li>
                <li>Acer</li>
                <li>Apple</li>
                <li>MSI</li>
                <li>Hp</li>
                <li>Dell</li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/" onClick={(e) => toggleMenu("accessories", e)}>
              <JoystickIcon /> Acessories
            </Link>

            {openMenus.accessories && (
              <ul className={`side-submenu ${openMenus.accessories ? "open" : ""}`}>
                <li>Item</li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/" onClick={(e) => toggleMenu("others", e)}>
              <OthersIcon /> Others
            </Link>

            {openMenus.others && (
              <ul className={`side-submenu ${openMenus.others ? "open" : ""}`}>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/">
              <PhoneIcon /> Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidemenu;
