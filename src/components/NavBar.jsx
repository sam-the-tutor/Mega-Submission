import React from 'react';
const NavBar = () => {
  const { isConnected, principalID } = useSelector((state) => state.plug);
  return (
    <div className="px-5 mx-auto">
      <nav className="flex justify-between mt-4">
        <div className="flex justify-between items-center w-full">
          <img
            src="./../assets/pwmanagerlogo.png"
            className="h-7 w-12 mt-0"
            alt="Logo"
          />
          <div className="px-4 cursor-pointer md:hidden">
            {/* menu icon for small screens */}
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </div>
        <div className=" gap-4 hidden md:flex font-mono">
          {isConnected ? (
            <div className="flex cursor-pointer rounded-full px-2 justify-center items-center">
              {/* <span className="whitespace-nowrap">
                {shortenString(principalID?.toString())}
              </span> */}
              <div className="rounded-full border ml-2">
                {/* <Link to="dashboard/profile">
                  <Identicon
                    className="p-1"
                    size={34}
                    padding={1}
                    string={shortenString(principalID?.toString())}
                  />
                </Link> */}
                <ConnectButton />
                <ConnectDialog />
              </div>
            </div>
          ) : (
            <>
              <ConnectButton />
              <ConnectDialog />
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
