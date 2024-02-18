import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
// import { createActor } from '../Utils/createActor';

import {
  canisterId as backendCanisterID,
  createActor,
} from '../declarations/backend';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useGetInfo from './useGetInfo';
import useGetTokenPrices from './useGetTokenPrices';
import useGetTokenBalances from './useGetTokenBalances';
import { createAgent } from '@dfinity/utils';
import { ClipLoader } from 'react-spinners';

// import { Principal } from '@dfinity/principal';
const IdentityHost =
  process.env.DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app/#authorize'
    : `http://localhost:4943?canisterId=cbopz-duaaa-aaaaa-qaaka-cai#authorize`;
//One day in nanoseconds

const HOST =
  process.env.DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app/#authorize'
    : 'http://localhost:4943';

const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);

const defaultOptions = {
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: IdentityHost,
    // Maximum authorization expiration is 8 days
    maxTimeToLive: days * hours * nanoseconds,
  },
};
const useAuthentication = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getExtendedTokenData, getTokenPrices } = useGetTokenPrices();
  const [buttonLoading, setButtonLoading] = useState(false);

  //function to log in and set the backend actor
  async function login() {
    setButtonLoading(true);
    try {
      const authClient = await AuthClient.create(defaultOptions.createOptions);

      if (await authClient.isAuthenticated()) {
        console.log(await authClient.isAuthenticated());
        //handleAuthentication
        handleAuthenticated(authClient);
      } else {
        //login
        await authClient.login({
          identityProvider: IdentityHost,
          onSuccess: () => {
            handleAuthenticated(authClient);
          },
        });
      }
    } catch (error) {
      console.log('error in login:', error);
    }
  }
  const LoginButton = () => {
    return (
      <>
        {buttonLoading ? (
          <ClipLoader color="white" />
        ) : (
          <button
            className="border p-1 shadow-lg shadow-black rounded-md w-1/4"
            onClick={login}
          >
            Login
          </button>
        )}
      </>
    );
  };
  const LoginOutButton = () => {
    return (
      <div className="mt-5 w-full flex items-center justify-center">
        {buttonLoading ? (
          <ClipLoader color="white" />
        ) : (
          <button
            className="border p-1 w-full mr-4 shadow-lg shadow-black rounded-md"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    );
  };

  async function logout() {
    const authClient = await AuthClient.create(defaultOptions.createOptions);

    await authClient?.logout();
    handleAuthenticated(authClient);
  }

  async function handleAuthenticated(authClient) {
    //get the identity
    if (!(await authClient?.isAuthenticated())) {
      navigate('/');
      return;
    }
    console.log('authclient :', authClient);
    const identity = authClient.getIdentity();

    //get the principal id
    const principal = identity.getPrincipal();

    //create the authenticated actor for the backend
    const actor = createActor(backendCanisterID, {
      agentOptions: {
        identity,
      },
    });

    const agent = await createAgent({
      identity,
      host: HOST,
    });

    await queryClient.setQueryData(['agent'], agent);

    await queryClient.setQueryData(['backendActor'], actor);
    await queryClient.setQueryData(['identity'], identity);
    await queryClient.setQueryData(
      ['isUserAuthenticated'],
      await authClient?.isAuthenticated(),
    );
    await queryClient.setQueryData(['principal'], principal?.toString());
    await queryClient.setQueryData(['authClient'], authClient);
    //load the user info and the icp addresses

    //fetch the user info and set it there.
    const info = await actor?.getPrincipalToMonitorInfo(principal?.toString());
    console.log('email is here :', info);
    await queryClient.setQueryData(['userInfo'], info?.ok);
    //fetch the user addresses
    const addresses = await actor?.getAllUserICPAddresses(principal);
    await queryClient.setQueryData(['userPrincipalAddresses'], addresses?.ok);

    const tokenData = await getTokenPrices();
    const extendedData = await getExtendedTokenData();

    await queryClient.setQueryData(['tokenPrices'], tokenData);
    await queryClient.setQueryData(['extendedTokenData'], extendedData);
    setButtonLoading(false);
    navigate('/dashboard');
  }

  return { login, handleAuthenticated, logout, LoginButton, LoginOutButton };
};

export default useAuthentication;
