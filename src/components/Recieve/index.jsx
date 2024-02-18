import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { copyToClipboard, shorten17String } from '../../Utils/Functions';
import { useQuery } from '@tanstack/react-query';
const index = () => {
  const { data: principalID } = useQuery({
    queryKey: ['principal'],
  });

  // const { principalID } = useSelector((state) => state.plug);
  const [selectedOption, setSelecedOption] = useState('ICP');
  console.log(selectedOption);

  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className="flex w-full mt-10 justify-center items-center rounded-lg"
    >
      <div
        style={{ backgroundColor: '#11131f', height: '70vh' }}
        className="flex flex-col items-center rounded-lg gap-4 w-1/2"
      >
        <div className="flex w-full flex-col justify-center items-center gap-4 mb-2">
          <div className="flex p-4 text-2xl uppercase border-b-2 w-3/4 justify-center items-center ">
            Recieve
          </div>
          <div className="flex gap-10">
            <div
              className="hover:cursor-pointer"
              onClick={() => setSelecedOption('ICP')}
            >
              ICP
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => setSelecedOption('OTHER')}
            >
              OTHER
            </div>
          </div>
        </div>

        {selectedOption === 'ICP' && principalID && (
          <div className="flex flex-col justify-center items-center gap-2">
            <div
              style={{ backgroundColor: '#11131f' }}
              className="border rounded-lg  p-4"
            >
              <QRCodeCanvas
                size={200}
                value={AccountIdentifier.fromPrincipal({
                  principal: Principal.fromText(principalID),
                  subAccount: undefined,
                }).toHex()}
              />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <span>
                {shorten17String(
                  AccountIdentifier.fromPrincipal({
                    principal: Principal.fromText(principalID),
                    subAccount: undefined,
                  }).toHex(),
                )}
              </span>

              <FaRegCopy
                className="hover:cursor-pointer"
                onClick={() =>
                  copyToClipboard(
                    AccountIdentifier.fromPrincipal({
                      principal: Principal.fromText(principalID),
                      subAccount: undefined,
                    }).toHex(),
                  )
                }
              />
            </div>
          </div>
        )}

        {selectedOption === 'OTHER' && principalID && (
          <div className="flex flex-col justify-center items-center gap-2">
            <div
              style={{ backgroundColor: '#11131f' }}
              className="border rounded-lg p-4"
            >
              <QRCodeCanvas size={200} value={principalID} />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div>{shorten17String(principalID)}</div>
              <FaRegCopy
                className="hover:cursor-pointer"
                onClick={() => copyToClipboard(principalID)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
