import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidedashboard.css';

import {
  RiHome2Line as HomeIcon,
  RiUserSearchLine as UsersIcon,
  RiNotification3Line as Notification,
  RiFileListLine as OrdersIcon,
  RiShapesLine as ProductsIcon,
  RiFileAddLine as Approve,
  RiDeviceLine as Device,
  RiArchive2Line as Arhive
} from "react-icons/ri";

import { Activity } from 'lucide-react';

import { IoAnalyticsOutline as Analytics } from "react-icons/io5";
import { TbLayoutSidebarRightExpand as Collapse, TbLayoutSidebarRightCollapse as Expand } from "react-icons/tb";
import { MdOutlineSecurity as PermissionsIcon} from "react-icons/md";
import useAuthStore from '../../../stores/useAuthStore.jsx';

const SideDashboard = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useAuthStore(); // Current logged in user
  


  return (
    <>
    <aside className={`sidebar ${openSidebar ? "open" : ""}`}>
      <div id="sidebar-toggle" onClick={() => setOpenSidebar(!openSidebar)}>
        <span>{openSidebar ? "Dashboard" : ""}</span>
        {openSidebar ? <Collapse /> : <Expand />}
      </div>

      <ul id="info-list">
        {/* Home Page - visible to everyone */}
        <li className="menu">
          <span className="menu-title">
            <Link to="/">
              <HomeIcon /> <span className='head-line'>Home Page</span>
            </Link>
          </span>
        </li>
       

        {/* Dashboard */}
        {(user?.role === "admin" || user?.permissions?.dashboard) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="/admin-dashboard">
                <Device /> <span className='head-line'>Dashboard</span>
              </Link>
            </span>
          </li>
        )}

      

        {/* Notifications - visible to everyone */}
        <li className="menu">
          <span className="menu-title">
            <Link to="notifications">
              <Notification /> <span className='head-line'>Notifications</span>
            </Link>
          </span>
        </li>

        {/* Products */}
        {(user?.role === "admin" || user?.permissions?.products) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="products">
                <ProductsIcon /> <span className='head-line'>Products</span>
              </Link>
            </span>
          </li>
        )}

        {/* Orders */}
        {(user?.role === "admin" || user?.permissions?.orders) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="orders">
                <OrdersIcon /> <span className='head-line'>Orders</span>
              </Link>
            </span>
          </li>
        )}

        {/* Users */}
        {(user?.role === "admin" || user?.permissions?.users) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="users">
                <UsersIcon /> <span className='head-line'>Users</span>
              </Link>
            </span>
          </li>
        )}

        {/* Analytics */}
        {(user?.role === "admin" || user?.permissions?.analytics) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="analytics">
               <Analytics /> <span className='head-line'>Analytics</span>
              </Link>
            </span>
          </li>
        )}

        {/* Approvals */}
        {(user?.role === "admin" || user?.permissions?.approvals) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="approvals">
                <Approve /> <span className='head-line'>Approvals</span>
              </Link>
            </span>
          </li>
        )}

        {/* Archive */}
        {(user?.role === "admin" || user?.permissions?.archive) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="archive">
                <Arhive /> <span className='head-line'>Archive</span>
              </Link>
            </span>
          </li>
        )}

        {/* Permissions */}
        {(user?.role === "admin" || user?.permissions?.permissions) && (
          <li className="menu">
            <span className="menu-title">
              <Link to="permissions">
                <PermissionsIcon /> <span className='head-line'>Permissions</span>
              </Link>
            </span>
          </li>
        )}

         <li className="menu">
          <span className="menu-title">
            <Link to="vitals">
              <Activity size={16}/> <span className='head-line'>Vitals</span>
            </Link>
          </span>
        </li>

      </ul>
    </aside>
    </>
  );
};

export default SideDashboard;
