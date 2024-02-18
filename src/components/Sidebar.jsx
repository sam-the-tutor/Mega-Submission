import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { GiBuyCard } from 'react-icons/gi';
import { LuSendHorizonal } from 'react-icons/lu';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdRocketLaunch } from 'react-icons/md';
import { RiNftFill } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import useGetAuthentication from '../Hooks/useAuthentication';
const Sidebar = () => {
  const { LoginOutButton } = useGetAuthentication();
  return (
    <div className="flex flex-col gap-4 mt-10">
      <div>
        <div>Internet Computer</div>
        <span>Portfolio</span>
      </div>
      {/* the tabs */}
      <div className="justify-center align-center">
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <MdDashboard className="mt-1" />

          <Link to="/dashboard">Dashboard</Link>
        </div>
        {/* <div className="flex items-center p-2 gap-4 hover:bg-yellow-500 focus:bg-red-200">
          <IoMdAddCircleOutline />
          <Link to="./buy">Buy</Link>
        </div> */}
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <IoArrowForwardOutline />
          <Link to="./send">Send</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <IoArrowBackOutline />
          <Link to="./recieve">Recieve</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <RiNftFill />
          <Link to="./nfts">NFTs</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <TfiWrite />
          <Link to="./inscriptions">Inscriptions</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <MdRocketLaunch />
          <Link to="./launch">Launchpad</Link>
        </div>
      </div>
      <LoginOutButton />
    </div>
  );
};

export default Sidebar;
