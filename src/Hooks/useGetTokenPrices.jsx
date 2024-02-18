import React, { useState } from 'react';
import { extendedTokenData, tokenPriceData } from '../Utils/Data';
import { createActor } from '../Utils/createActor';
import { price_oracle_idlFactory } from '../Utils/priceOracle.did';
import { formatExtendedTokenData } from '../Utils/Functions';
import { useQuery } from '@tanstack/react-query';

const useGetTokenPrices = () => {
  const [tokenInfo, setTokenInfo] = useState(null);

  const infoResults = useQuery({
    queryKey: ['tokenPrices'],
    queryFn: () => getTokenPrices(),
  });

  const extendedResults = useQuery({
    queryKey: ['extendedTokenData'],
    queryFn: () => getExtendedTokenData(),
  });

  async function getTokenPrices() {
    try {
      //   if (process.env.DFX_NETWORK !== 'ic') {
      //load the dummy data

      return tokenPriceData;
      //   } else {
      //     console.log('fetching onchain price data');
      //     //create an actor
      //     const tokenActor = createActor(
      //       PRICE_ORACLE_CANISTER_ID,
      //       price_oracle_idlFactory,
      //     );

      //     return await tokenActor?.get_latest();
      //   }
    } catch (error) {
      console.log('error in getting token prices :', error);
    }
  }

  async function getExtendedTokenData() {
    try {
      //   if (process.env.DFX_NETWORK !== 'ic') {
      return extendedTokenData;
      //   } else {
      //     console.log('fetching onchain extended price data');
      //     //create an actor
      //     const tokenActor = createActor(
      //       PRICE_ORACLE_CANISTER_ID,
      //       price_oracle_idlFactory,
      //     );
      //     return await tokenActor?.get_latest_extended();
      //   }
    } catch (error) {
      console.log('error in getting token prices :', error);
    }
  }

  async function getTokenInfo(tokenName) {
    const results = formatExtendedTokenData(tokenName, extendedTokenData);
    setTokenInfo(results);
  }

  return { getTokenPrices, getExtendedTokenData, getTokenInfo, tokenInfo };
};

export default useGetTokenPrices;
