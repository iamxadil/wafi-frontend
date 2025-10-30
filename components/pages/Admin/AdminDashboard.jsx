import React from 'react';
import { Outlet } from "react-router-dom";
import SideDashboard from './layouts/SideDashboard.jsx';

const AdminDashboard = () => {
  return (
    <div id='admin-dashboard' style={{ display: 'flex', minHeight: '100vh' }}>
      <SideDashboard />
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
