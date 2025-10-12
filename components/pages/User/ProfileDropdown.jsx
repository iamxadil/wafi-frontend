import React from 'react';
import {
  RiHeart2Line as HeartIcon,
  RiFileListLine as OrdersIcon,
  RiSettings2Line as SettingsIcon,
  RiLogoutBoxLine as LogoutIcon
} from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore.jsx';

const ProfileDropdown = ({ className, onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const handleClick = (e) => {
    e.stopPropagation(); 
  };

  return (
    <ul className={`profile-dropdown ${className || ''}`} onClick={handleClick}>
      <li onClick={onClose}><Link to="/my-orders"><OrdersIcon/> My Orders </Link></li>
      <li onClick={onClose}> <Link to="/settings"><SettingsIcon/> Settings</Link></li>
      <li onClick={handleLogout}>
        <LogoutIcon />Logout
      </li>
    </ul>
  );
};

export default ProfileDropdown;
