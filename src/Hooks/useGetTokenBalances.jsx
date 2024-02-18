import React, { useState } from 'react';
import {
  CanisterIDS,
  ProcessData,
  getIndividualIdHoldings,
  getLocalCanisterID,
} from '../Utils/Functions';
import { icrcIdlFactory } from '../Utils/icrc1_ledger.did';
import { createActor } from '../Utils/createActor';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { createAgent } from '@dfinity/utils';
import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';
import { IcrcLedgerCanister } from '@dfinity/ledger-icrc';

const useGetTokenBalances = () => {
  const [singleTokenBalance, setSingleTokenBalance] = useState(null);
  const [indIdHoldings, setIndIdHoldings] = useState(null);

  const queryClient = useQueryClient();
  const { data: userPrincipalAddresses } = useQuery({
    queryKey: ['userPrincipalAddresses'],
  });

  const infoResults = useQuery({
    queryKey: ['userTokenBalances'],
    queryFn: () => getAllTokenBalances(),
  });

  const { data: tokenPrices } = useQuery({
    queryKey: ['tokenPrices'],
  });

  const { data: agent } = useQuery({
    queryKey: ['agent'],
  });

  async function getAllTokenBalances() {
    console.log('principalsss :', userPrincipalAddresses);
    const userBalances = {};
    if (!userPrincipalAddresses || !agent) return { err: 'not allowed' };

    try {
      for (const princID of userPrincipalAddresses) {
        for (const canID of CanisterIDS) {
          let TokenLedger = createActor(canID, icrcIdlFactory, agent);

          // Perform asynchronous operations to retrieve balance and token metadata
          const bal = await TokenLedger?.icrc1_balance_of({
            owner: Principal.fromText(princID.address),
            subaccount: [],
          });
          const tokenMetadata = await TokenLedger.icrc1_metadata();

          // Create a new balance object
          const newBalance = {
            amount: Number(bal),
            canister_id: canID,
            token_symbol: tokenMetadata[2][1]?.Text,
            token_decimals: Number(tokenMetadata[0][1]?.Nat),
          };

          // Check if the principal_id already exists in userBalances
          if (userBalances[princID.address]) {
            // If it exists, push the new balance object to the balances array
            userBalances[princID.address].balances.push(newBalance);
          } else {
            // If it doesn't exist, create a new entry in userBalances
            userBalances[princID.address] = {
              principal_id: princID.address,
              balances: [newBalance],
            };
          }
        }
      }
      console.log('user balances functions :', userBalances);
      // Process the data, set user token balances, portfolio value, and percentage holdings
      const { tokenHoldings, totalPortfolioValue } = ProcessData(
        Object.values(userBalances), // Convert userBalances object to an array of values
        tokenPrices,
      );
      await queryClient.setQueryData(['userTokensData'], {
        userBalances: Object.values(userBalances),
        percentagePerToken: tokenHoldings,
        totalPortfolioValue,
      });

      return {
        userBalances: Object.values(userBalances),
        percentagePerToken: tokenHoldings,
        totalPortfolioValue,
      };
    } catch (error) {
      console.log('error in front balances', error);
    }
  }

  async function getSingleTokenBalance(tokenName, principalID) {
    if (!principalID) return;
    try {
      // get the local token ledger
      const ledgerID = getLocalCanisterID(tokenName);
      const ledgerActor = createActor(ledgerID, icrcIdlFactory, agent);
      const balance = await ledgerActor?.icrc1_balance_of({
        owner: Principal.fromText(principalID),
        subaccount: [],
      });
      setSingleTokenBalance(Number(balance) / 1e8);
    } catch (error) {
      console.log('error in getting the token balance :', error);
    }
  }

  async function getIndHoldings(tokenName, userBalances) {
    if (!userBalances || !tokenName) {
      console.log('hehe :');
      return;
    }

    try {
      const results = getIndividualIdHoldings(tokenName, userBalances);
      const filteredResults = results?.filter((token) => token.amount !== 0);
      setIndIdHoldings(filteredResults);
    } catch (error) {
      console.log('error in getting the individual id holdings :', error);
    }
  }

  async function invalidateUserTokenData() {
    console.log('invalidating tokens data');
    await queryClient.invalidateQueries(['userTokensData']);
  }

  async function transferICPTokens(canisterID, data) {
    try {
      //create the icp actor ledger
      const actor = LedgerCanister.create({
        agent,
        canisterId: canisterID,
      });

      const acc = AccountIdentifier.fromHex(data?.tokenRecipient);
      const amount = Number(data?.tokenAmount) * 1e8;
      const transfer = await actor.transfer({
        to: acc,
        amount: amount,
        memo: undefined,
        fee: undefined,
        // fromSubAccount: [],
        // createdAt: [],
      });
      if (transfer) {
        return { ok: transfer };
      } else {
        return { err: 'no success' };
      }
    } catch (error) {
      console.log('error in transfering icp :', error);
    }
  }

  async function transferICRCTokens(canisterID, data) {
    console.log('canister id :', canisterID);
    try {
      const actor = IcrcLedgerCanister.create({
        agent,
        canisterId: canisterID,
      });

      const amount = Number(data.tokenAmount) * 1e8;
      const transfer = await actor.transfer({
        to: {
          owner: Principal.fromText(data.tokenRecipient),
          subaccount: [],
        },
        amount: amount,
      });
      if (transfer) {
        return { ok: transfer };
      } else {
        return { err: 'no success' };
      }
    } catch (error) {
      console.log('error in transfer icrc token :', error);
    }
  }

  return {
    getAllTokenBalances,
    singleTokenBalance,
    getSingleTokenBalance,
    invalidateUserTokenData,
    getIndHoldings,
    transferICPTokens,
    indIdHoldings,
    transferICRCTokens,
  };
};

export default useGetTokenBalances;
