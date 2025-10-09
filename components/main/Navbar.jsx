import React, { useEffect, useState } from "react";
import "../../styles/navbar.css";

import {
  RiHome2Line as HomeIcon,
  RiShoppingCartLine as CartIcon,
  RiAccountCircleLine as ProfileIcon,
  RiDashboardLine as DashboardIcon
} from "react-icons/ri";

import {
  IoLaptopOutline as LaptopIcon,
  IoGameControllerOutline as JoystickIcon,
  IoShapesOutline as OthersIcon,
  IoMenu as Hamburger,
} from "react-icons/io5";

import { Link } from "react-router-dom";
import DarkMode from '../main/Darkmode.jsx';
import Sidemenu from "./Sidemenu.jsx";
import ProfileDropdown from "../pages/User/ProfileDropdown.jsx";
import useAuthStore from "../stores/useAuthStore.jsx";
import useCartStore from "../stores/useCartStore.jsx";
import useWindowWidth from "../hooks/useWindowWidth.jsx";

const Navbar = () => {
  const [isDropdown, setDropdown] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const {user} = useAuthStore();
  const cartItems = useCartStore(state => state.cart);

  const toggleDropdown = () => setDropdown(!isDropdown);
  const width = useWindowWidth();


  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const toggleSideMenu = () => setSideMenuOpen(!isSideMenuOpen);

  useEffect(() => {
    profile();
   }, [profile])

  return (
    <>
      <nav id="navbar">
        <div className="container">
          <Link to="/">
            <div id="logo"></div>
          </Link>
        </div>

        <ul id="nav-links">
          <li>
            <Link to="/">
              <span><HomeIcon /></span>
              <span>Home</span>
            </Link>
          </li>

          <li>
            <span><LaptopIcon /></span>
          <Link to="/laptops">Laptops</Link>
         <ul className="submenu">
            <li><Link to="/category/laptops/Asus">Asus</Link></li>
            <li><Link to="/category/laptops/Acer">Acer</Link></li>
            <li><Link to="/category/laptops/Apple">Apple</Link></li>
            <li><Link to="/category/laptops/Lenovo">Lenovo</Link></li>
            <li><Link to="/category/laptops/HP">HP</Link></li>
            <li><Link to="/category/laptops/Microsoft">Microsoft</Link></li>
            <li><Link to="/category/laptops/Dell">Dell</Link></li>
        </ul>
          </li>

          <li>
            <span><JoystickIcon /></span>
            <Link to="/accessories">Accessories</Link>
            <ul className="submenu">
              <li><Link to="/category/Keyboards">Keyboards</Link></li>
              <li><Link to="/category/Mice">Mice</Link></li>
              <li><Link to="/category/Headphones">Headphones</Link></li>
              <li><Link to="/category/Joysticks">Joysticks</Link></li>
            </ul>
          </li>

          <li>
            <span><OthersIcon /></span>
            <a href="#">Others</a>
            <ul className="submenu">
              <li><Link to="/category/Routers">Routers</Link></li>
              <li><Link to="/category/Cabels">Cabels</Link></li>
              <li><Link to="/category/Adapters">Adapters</Link></li>
            </ul>
          </li>
        </ul>

        <ul id="user-interaction">
          <Link to="/cart">
          <li className="icon" data-count={cartItems.length} id="cart">
          <span><CartIcon /></span>
           </li></Link>

          <DarkMode/>

            {(user?.role === "admin" || user?.role === "moderator") && (
                <li className="icon">
                  <Link to="/admin-dashboard" style={{ display: "flex", alignItems: "center" }}>
                    <span><DashboardIcon /></span>
                    <span className="text dash">Dashboard</span>
                  </Link>
                </li>
              )}

          <li onClick={toggleDropdown} style={{ position: "relative", cursor: "pointer" }} className="profile icon">
            {user ? (
              <>
                <span><ProfileIcon /></span>
                <span className="user-container">
                  <span className="user">{user.name}</span>
                  <ProfileDropdown className={isDropdown ? "show" : ""} onClose={() => {setDropdown(!isDropdown)}}/>
                </span>
              </>
            ) : (
              <Link to="/signin">
                <span className="user-container">
                  <span><ProfileIcon /></span>
                  <span className="user">Sign In</span>
                </span>
              </Link>
            )}
          </li>
          

          {width < 1150 && 

            <Hamburger 
            size={25} 
            onClick={() => toggleSideMenu()} 
            style={{ cursor: "pointer" }}
          />
          }    
        </ul>
      </nav>
      
       {isSideMenuOpen && (
        <Sidemenu isOpen={isSideMenuOpen} setIsOpen={setSideMenuOpen} />
      )}
      
      <div id="spacer" style={{height: "80px"}}></div>
    </>
  );
};

export default Navbar;
