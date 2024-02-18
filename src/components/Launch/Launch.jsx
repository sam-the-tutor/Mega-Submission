import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
// import useGetNftBalances from '../Hooks/useGetNftBalances'
const Launch = () => {
  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className="flex flex-col  w-full mt-10 justify-center items-center rounded-lg"
    >
      <h1>Welcome to our Launchpad</h1>
      <div className="w-full flex justify-center gap-4 p-5">
        <div
          style={{ backgroundColor: '#11131f' }}
          className="border p-5 rounded-md shadow-md justify-center flex items-center shadow-black hover:cursor-pointer"
        >
          Token
        </div>
        <div
          style={{ backgroundColor: '#11131f' }}
          className="border p-6 rounded-md shadow-md justify-center flex items-center shadow-black hover:cursor-pointer"
        >
          NFTs
        </div>
      </div>
    </div>
  );
};

export default Launch;
