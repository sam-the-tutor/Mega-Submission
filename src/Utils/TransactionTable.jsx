import React from 'react';
import { shortenString } from './Functions';
import { TiFlowMerge } from 'react-icons/ti';
const TransactionTable = ({ data, tokenName }) => {
  return (
    <table className="table-auto min-w-full">
      <thead>
        <tr>
          <th className=" px-4 py-2">ID</th>
          <th className=" px-4 py-2">Kind</th>
          <th className=" px-4 py-2">From</th>
          <th className=" px-4 py-2">To</th>
          <th className=" px-4 py-2">Amount ({tokenName})</th>
          <th className=" px-4 py-2">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data?.map((item, index) => (
            <tr key={index}>
              <td className=" py-2">{item.id}</td>
              <td className="  py-2">{item.kind}</td>
              <td className=" py-2">
                {item?.from === 'mintAccount' ? (
                  <TiFlowMerge className="text-3xl justify-center flex ml-12" />
                ) : (
                  shortenString(item?.from)
                )}
              </td>
              <td className=" py-2">
                {item?.to === 'mintAccount' ? 'sam' : shortenString(item?.to)}
              </td>
              <td className=" py-2">{item.amount}</td>
              <td className=" py-2">{item.timestamp}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
