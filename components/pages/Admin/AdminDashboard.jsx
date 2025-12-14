import React from 'react';
import { Outlet } from "react-router-dom";
import SideDashboard from './layouts/SideDashboard.jsx';
import useWindoWidth from '../../hooks/useWindowWidth.jsx';
import BottomDashboard from './layouts/BottomDashboard.jsx';

const AdminDashboard = () => {

  const width = useWindoWidth();

  return (
    <div id='admin-dashboard' style={{ display: 'flex', minHeight: '100vh' }}>
      {width > 1350 && <SideDashboard />}
      {width <= 1350 && <BottomDashboard />}
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
