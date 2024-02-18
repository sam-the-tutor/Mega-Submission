import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGetTokenPrices from '../../Hooks/useGetTokenPrices';
import useGetTokenBalances from '../../Hooks/useGetTokenBalances';
import { PiSwap } from 'react-icons/pi';
import { FaRobot } from 'react-icons/fa6';
import { RiExchangeFundsLine, RiRobot2Line } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
const TokenInfo = () => {
  const { token } = useParams();
  const { data: userTokenBalances } = useQuery({
    queryKey: ['userTokensData'],
  });

  const { getTokenInfo, tokenInfo } = useGetTokenPrices();
  const { getIndHoldings, indIdHoldings } = useGetTokenBalances();
  useEffect(() => {
    getTokenInfo(token);
    getIndHoldings(token, userTokenBalances?.userBalances);
  }, [token]);

  console.log('token nnn :', tokenInfo, indIdHoldings);
  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className=" w-full mt-10 flex gap-2 justify-between rounded-lg p-2"
    >
      <div
        style={{ height: '70vh' }}
        className="flex flex-col gap-4  w-3/4 mt-10 rounded-lg"
      >
        <div
          className="rounded-lg"
          style={{ backgroundColor: '#11131f', height: '60vh' }}
        >
          <div className="flex justify-between rounded-lg p-4">
            <div>
              <div>{tokenInfo && tokenInfo[0].symbol}</div>

              <div>$ {tokenInfo && tokenInfo[0].price_USD}</div>
            </div>
            <div style={{ color: 'yellow' }} className="flex gap-2  text-xs">
              <div className="flex flex-col gap-1">
                Marketcap(USD)
                <span>{tokenInfo && tokenInfo[0].marketcap_USD}</span>
              </div>

              <div className="flex flex-col gap-1">
                Total Supply
                <span>{tokenInfo && tokenInfo[0].total}</span>
              </div>
              <div className="flex flex-col gap-1">
                Volume(USD)
                <span>{tokenInfo && tokenInfo[0].volume_USD}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <span>1H</span>
              <span>1M</span>
              <span>1Y</span>
            </div>
          </div>
          <div>chart here</div>
        </div>

        <div>
          <h1 className="text-xl">Holdings</h1>
          <div
            className="rounded-lg w-full mt-2"
            // style={{ backgroundColor: '#11131f' }}
          >
            {indIdHoldings &&
              indIdHoldings.map((data) => {
                return (
                  <div
                    style={{ backgroundColor: '#11131f' }}
                    className="flex justify-between px-4 mb-1 rounded-md"
                    key={data.principal_id}
                  >
                    <span>{data.principal_id}</span>
                    <span>
                      {data.amount} {token}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="flex flex-col w-1/4 justify-evenly"
        style={{ height: '70vh' }}
      >
        <div
          style={{ backgroundColor: '#11131f' }}
          className="flex py-2 gap-2 justify-evenly items-center rounded-lg border"
        >
          <RiExchangeFundsLine size={35} color="yellow" />

          <div className="flex text-center flex-col gap-1 justify-center items-center">
            <span>Staking</span>
            <span>coming soon...</span>
          </div>
        </div>
        <div
          style={{ backgroundColor: '#11131f' }}
          className="flex py-2 gap-2 justify-evenly items-center rounded-lg border"
        >
          <PiSwap size={35} color="yellow" />

          <div className="flex text-center flex-col gap-1 justify-center items-center">
            <span>Swap</span>
            <span>coming soon...</span>
          </div>
        </div>
        <div
          style={{ backgroundColor: '#11131f' }}
          className="flex py-2 gap-2 justify-evenly items-center rounded-lg border"
        >
          <FaRobot size={35} color="yellow" />
          <div className="flex text-center flex-col gap-1 justify-center items-center">
            <span>Bots</span>
            <span>coming soon...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
