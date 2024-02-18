import React, { useEffect } from 'react';
import useAuthentication from '../../Hooks/useAuthentication';
const index = () => {
  const { LoginButton } = useAuthentication();
  return (
    <div>
      <div className=" md:flex mt-10 justify-center">
        <div className="flex flex-col justify-center items-center md:w-1/2">
          <h2 className="text-bold text-purple-500 md:text-6xl text-2xl">
            ICP Portfolio
          </h2>
          <span className="items-center justify-center flex-wrap px-20 py-5">
            A portfolio manager Dapp built on the Internet computer. Track,
            monitor, and maximize your crypto
          </span>
          <LoginButton />
        </div>

        <div className="md:w-1/2 mt-10">
          <img
            className="w-full h-[500px]"
            src="../../assets/port.png"
            alt="portfolio"
          />
        </div>
      </div>
    </div>
  );
};

export default index;
