import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
Sidebar;
const SharedDashboard = () => {
  return (
    <div className="flex w-full">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
};

export default SharedDashboard;
