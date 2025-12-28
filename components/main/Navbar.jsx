import React, { useState, memo } from "react";
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
  Puzzle
} from "lucide-react";
import { CgMenuRightAlt as Menu } from "react-icons/cg";
import { Link } from "react-router-dom";

import DarkMode from "../main/Darkmode.jsx";
import Logo from "../common/Logo.jsx";
import ChangeLanguage from "../pages/User/ChangeLanguage.jsx";
import Sidemenu from "./Sidemenu.jsx";
import ProfileDropdown from "../pages/User/ProfileDropdown.jsx";

import useFavoritesStore from "../stores/useFavoritesStore";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";
import useTranslate from "../hooks/useTranslate.jsx";

// ✅ Pre-memoize static menu data

const LAPTOP_BRANDS = ["Asus", "Acer", "Apple", "Lenovo", "HP", "MSI", "Microsoft", "Dell"];
const ACCESSORIES = ["Headphones", "Speakers", "Bags", "Mice", "Keyboards", "Combo Kb & M", "Cooling Pads", "Mousepads & Deskpads"];
const COMPONENTS = ["Hard Disks & SSDs", "RAM"];
const OTHERS = ["Monitors"];


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdown, setDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const { user } = useAuthStore();
  const cartItems = useCartStore((s) => s.cart);
  const favorites = useFavoritesStore((s) => s.favorites || []);
  const width = useWindowWidth();
  const t = useTranslate();

  const toggleDropdown = () => setDropdown((p) => !p);

  const NavList = memo(() => (
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
        <ul className={`submenu glassy ${activeMenu === "laptops" ? "show" : ""}`}>
          <div className="submenu-group">
            {LAPTOP_BRANDS.map((brand) => (
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
        <ul className={`submenu glassy ${activeMenu === "accessories" ? "show" : ""}`}>
          <div className="submenu-group">
            {ACCESSORIES.map((cat) => (
            <li key={cat}>
              <Link to={`/category/${cat}`}>
                {t(cat, {
                  Headphones: "سماعات رأس",
                  Speakers: "مكبرات صوت",
                  Bags: "حقائب",
                  Mice: "ماوسات",
                  Keyboards: "لوحات مفاتيح",
                  "Combo Kb & M": "كومبو كيبورد وماوس",
                  "Cooling Pads": "لوحات تبريد",
                  "Mousepads & Deskpads": "مفارش ماوسات",
                }[cat])}
              </Link>
            </li>
          ))}
          </div>
        </ul>
      </li>

     <li
        onMouseEnter={() => setActiveMenu("components")}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Link to="/components">
          <Puzzle size={20} />
          <span>{t("Components", "مكوّنات")}</span>
        </Link>

        <ul className={`submenu glassy ${activeMenu === "components" ? "show" : ""}`}>
          <div className="submenu-group">
            {COMPONENTS.map((item) => (
            <li key={item}>
              <Link to={`/category/${item}`}>
                {t(item, {
                  "Hard Disks & SSDs": "التخزين",
                  RAM: "الرامات",
                }[item])}
              </Link>
            </li>
          ))}
          </div>
        </ul>
      </li>

        <li
          onMouseEnter={() => setActiveMenu("others")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <Link to="/others">
            <Shapes size={20} />
            <span>{t("Others", "اخرى")}</span>
          </Link>

          <ul className={`submenu glassy ${activeMenu === "others" ? "show" : ""}`}>
            <div className="submenu-group">
             {OTHERS.map((item) => (
                <li key={item}>
                  <Link to={`/category/${item}`}>
                    {t(item, {
                      Monitors: "شاشات",
                    }[item])}
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        </li>
    </ul>
  ));

  return (
    <>
      <nav id="navbar" role="navigation" aria-label="Main Navigation">
        {/* === Left: Logo + theme toggles === */}
        <div className="container">
          <Link to="/" aria-label="Go to Home">
            <Logo/>
          </Link>
          {width > 1150 && (
            <>
              <DarkMode />
              <ChangeLanguage />
            </>
          )}
        </div>

        {/* === Center: Main Links === */}
        {width > 650 && <NavList />}

        {/* === Right: User Interactions === */}
        <ul id="user-interaction">
          {width <= 1150 && (
            <>
              <DarkMode />
              <ChangeLanguage />
            </>
          )}

          {width > 1150 && (
            <>
              <Link to="/cart">
                <li className="icon" data-count={cartItems.length} id="cart">
                  <ShoppingCart size={21} />
                </li>
              </Link>

              <Link to="/favorites">
                <li className="icon" data-count={favorites.length} id="favorites">
                  <Heart size={21} />
                </li>
              </Link>
            </>
          )}

          {(user?.role === "admin" || user?.role === "moderator") && (
            <li className="icon">
              <Link to="/admin-dashboard" className="dash-link">
                <GaugeCircle size={20} />
              </Link>
            </li>
          )}

          {width > 1150 ? (
            <li
              onClick={toggleDropdown}
              className="profile icon"
              style={{ cursor: "pointer" }}
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
          ) : (
            <li className="icon">
              <Menu size={28} onClick={() => setMenuOpen(true)} />
            </li>
          )}
        </ul>
      </nav>

      {isDropdown && user && (
        <ProfileDropdown className="show" onClose={() => setDropdown(false)} />
      )}

      <Sidemenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <div id="spacer" style={{ height: "80px" }}></div>
    </>
  );
};

export default memo(Navbar);
