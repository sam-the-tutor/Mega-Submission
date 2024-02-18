import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const SharedLayout = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Suspense fallback={<div>loading ....</div>}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default SharedLayout;
