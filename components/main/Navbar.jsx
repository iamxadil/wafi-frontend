import React, { useState, useEffect } from "react";
import "../../styles/navbar.css";

import {
  Home,
  Laptop2,
  Gamepad2,
  Shapes,
  ShoppingCart,
  Heart,
  UserCircle,
  GaugeCircle,
} from "lucide-react";

import { CgMenuRightAlt as Menu} from "react-icons/cg";
import { Link } from "react-router-dom";
import DarkMode from "../main/Darkmode.jsx";
import ChangeLanguage from "../pages/User/ChangeLanguage.jsx";
import Sidemenu from "./Sidemenu.jsx";
import ProfileDropdown from "../pages/User/ProfileDropdown.jsx";

import useFavoritesStore from "../stores/useFavoritesStore";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdown, setDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const { user } = useAuthStore();
  const cartItems = useCartStore((state) => state.cart);
  const favorites = useFavoritesStore((state) => state.favorites || []);
  const width = useWindowWidth();
  const t = useTranslate();



  const toggleDropdown = () => setDropdown((p) => !p);

  return (
    <>
      <nav id="navbar">
        {/* Logo */}
        <div className="container">
          <Link to="/">
            <div id="logo"></div>
          </Link>

          {width > 1150 && 
            <>
              <DarkMode />
              <ChangeLanguage />  
            </>
          }
         
        </div>

        {/* ===== Navigation Links ===== */}
        <ul id="nav-links">
          <li>
            <Link to="/">
              <Home size={20} />
              <span>{t("Home", "الصفحة الرئيسية")}</span>
            </Link>
          </li>

          <li
            onMouseEnter={() => setActiveMenu("laptops")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link to="/laptops">
              <Laptop2 size={20} />
              <span>{t("Laptops", "لابتوبات")}</span>
            </Link>
            <ul
              className={`submenu glassy ${
                activeMenu === "laptops" ? "show" : ""
              }`}
            >
              <div className="submenu-group">
                {[
                  "Asus",
                  "Acer",
                  "Apple",
                  "Lenovo",
                  "HP",
                  "MSI",
                  "Microsoft",
                  "Dell",
                  
                ].map((brand) => (
                  <li key={brand}>
                    <Link to={`/category/laptops/${brand}`}>{brand}</Link>
                  </li>
                ))}
              </div>
            </ul>
          </li>

          <li
            onMouseEnter={() => setActiveMenu("accessories")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link to="/accessories">
              <Gamepad2 size={20} />
              <span>{t("Accessories", "اكسسوارات")}</span>
            </Link>
            <ul
              className={`submenu glassy ${
                activeMenu === "accessories" ? "show" : ""
              }`}
            >
              <div className="submenu-group">
                {["Keyboards", "Mice", "Headphones", "Bags"].map((cat) => (
                  <li key={cat}>
                    <Link to={`/category/${cat}`}>{cat}</Link>
                  </li>
                ))}
              </div>
            </ul>
          </li>

          <li
            onMouseEnter={() => setActiveMenu("others")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link to="#">
              <Shapes size={20} />
              <span>{t("Others", "اخرى")}</span>
            </Link>
            <ul
              className={`submenu glassy ${
                activeMenu === "others" ? "show" : ""
              }`}
            >
              <div className="submenu-group">
                {["Routers", "Cables", "Adapters", "Flash Drives", "Hard Disks & SSDs"].map((cat) => (
                  <li key={cat}>
                    <Link to={`/category/${cat}`}>{cat}</Link>
                  </li>
                ))}
              </div>
            </ul>
          </li>
        </ul>

        {/* ===== User Interaction ===== */}
        <ul id="user-interaction">

              {width <= 1150 && 
                <>
              <DarkMode/>
              <ChangeLanguage/>  
                </>
              }

          {width > 1150 && (
            <Link to="/cart">
              <li className="icon" data-count={cartItems.length} id="cart">
                <ShoppingCart size={21} />
              </li>
            </Link>
          )}

          {width > 1150 && (
            <Link to="/favorites">
              <li className="icon" data-count={favorites.length} id="favorites">
                <Heart size={21} />
              </li>
            </Link>
          )}

          {(user?.role === "admin" || user?.role === "moderator") && (
            <li className="icon">
              <Link
                to="/admin-dashboard"
                style={{ display: "flex", alignItems: "center" }}
              >
                <GaugeCircle size={20} />
                <span className="text dash">Dashboard</span>
              </Link>
            </li>
          )}

          {width > 1150 && (
            <li  onClick={toggleDropdown}  className="profile icon" style={{ position: "relative", cursor: "pointer" }}
            >
              {user ? (
                <>
                  <UserCircle size={22} />
                    <span className="user-container">
                    <span className="user">{user.name}</span>
                  </span>
                </>
              ) : (
                <Link to="/signin">
                  <span className="user-container">
                    <UserCircle size={22} />
                    <span className="user">Sign In</span>
                  </span>
                </Link>
              )}
            </li>
          )}

          {width <= 1150 && (
            <li className="icon">
              <Menu
                size={28}
                cursor="pointer"
                onClick={() => setMenuOpen(true)}
              />
            </li>
          )}
        </ul>
      </nav>
      
          {isDropdown && (
        <ProfileDropdown
          className="show"
          onClose={() => setDropdown(false)}
        />
      )}

      <Sidemenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <div id="spacer" style={{ height: "80px" }}></div>
    </>
  );
};

export default Navbar;
