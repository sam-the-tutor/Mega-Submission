import React, { useEffect, useState } from 'react';
import useGetTokenBalances from '../../Hooks/useGetTokenBalances';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getLocalCanisterID } from '../../Utils/Functions';
import { icp_idl_Factory } from '../../Utils/icpIdlFactory.did';
import { icrcIdlFactory } from '../../Utils/icrc1_ledger.did';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import { useMutation, useQuery } from '@tanstack/react-query';

const index = () => {
  const tokens = ['ICP', 'ckBTC', 'CHAT'];
  const { data: userAuthenticated } = useQuery({
    queryKey: ['isUserAuthenticated'],
  });
  const { data: identity } = useQuery({
    queryKey: ['identity'],
  });

  const { data: principalID } = useQuery({
    queryKey: ['principal'],
  });
  const [selectedToken, setselectedToken] = useState('');
  const {
    singleTokenBalance,
    getSingleTokenBalance,
    invalidateUserTokenData,
    transferICPTokens,
    transferICRCTokens,
  } = useGetTokenBalances();
  const [isLoading, setIsLoading] = useState(false);

  console.log(selectedToken, singleTokenBalance);
  function handleOptionChange(event) {
    setselectedToken(event.target.value);
  }

  useEffect(() => {
    getSingleTokenBalance(selectedToken, principalID);
  }, [selectedToken]);

  async function transferFunds(data) {
    console.log('transfer data :', data, selectedToken);
    setIsLoading(true);
    try {
      if (data.tokenAmount === '' || data.tokenRecipient === '') return;
      if (!userAuthenticated || !identity) return;
      const canisterID = getLocalCanisterID(selectedToken);
      if (selectedToken === 'ICP') {
        const results = await transferICPTokens(canisterID, data);
        console.log('icp transfer results :', results);
      } else {
        const rsults = await transferICRCTokens(canisterID, data);
        console.log('icrc transfer results :', rsults);
      }
      // setIsLoading(false);
    } catch (error) {
      console.log('error in tansferring tokens :', error);
    }
  }

  const { mutateAsync: HandleSendTokens } = useMutation({
    mutationFn: (data) => transferFunds(data),
    onSuccess: async () => {
      await invalidateUserTokenData();
      setIsLoading(false);
    },
  });

  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className="flex w-full mt-10 justify-center items-center rounded-lg"
    >
      <div
        style={{ backgroundColor: '#11131f', height: '80vh' }}
        className="flex flex-col items-center rounded-lg gap-4 w-1/2 absolute"
      >
        <h1 className="flex p-4 text-2xl uppercase border-b-2 w-3/4 justify-center items-center ">
          Transfer
        </h1>
        <div className="flex flex-col mt-2">
          <span>Account</span>
          <span>{principalID}</span>
        </div>
        {/* select token */}
        <div className="text-black text-sm">
          <select
            id="options"
            name="options"
            value={selectedToken}
            onChange={handleOptionChange}
            className="block mt-1 mb-2 rounded-md border-gray-300 "
          >
            <option value="">--Select token--</option>
            {tokens.map((tok) => {
              return (
                <option key={tok} value={tok}>
                  {tok}
                </option>
              );
            })}
          </select>
          {singleTokenBalance !== null && (
            <span className="text-white">Balance : {singleTokenBalance}</span>
          )}{' '}
        </div>

        <Formik
          initialValues={{ tokenRecipient: '', tokenAmount: '' }}
          validate={(values) => {
            const errors = {};

            if (!values.tokenRecipient) {
              errors.tokenRecipient = 'Reciever Id required';
            }
            if (!values.tokenAmount) {
              errors.tokenAmount = 'Token amount required';
            } else if (values.tokenAmount > singleTokenBalance) {
              errors.tokenAmount = 'Amount exceeds the available balance';
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            HandleSendTokens(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4 w-3/4 justify-center items-center text-black">
              <div className="flex-col gap-1 w-full">
                <label htmlFor="tokenAMount" className="text-white text-left">
                  {selectedToken === 'ICP'
                    ? 'enter reciever account Id'
                    : 'enter reciever Principal Id'}
                </label>
                <Field
                  type="text"
                  name="tokenRecipient"
                  // placeholder="enter reciever principal"
                  className="rounded-md h-8 w-full"
                />
                <ErrorMessage
                  name="tokenRecipient"
                  component="span"
                  className="text-white bg-red-500 p-1"
                />
              </div>
              <div className="flex-col gap-1 w-full">
                <label htmlFor="tokenAMount" className="text-white">
                  enter amount
                </label>
                <Field
                  type="number"
                  name="tokenAmount"
                  // placeholder="enter token amount"
                  className="rounded-md h-8 text-black w-full"
                />
                <div className="flex gap-8">
                  <span className="text-white flex text-left">
                    fee : 0.0001
                  </span>

                  <ErrorMessage
                    name="tokenAmount"
                    component="span"
                    className="text-white ml-16 bg-red-500 p-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-md text-white jus text-2xl hover:bg-yellow-500 w-1/2 mb-8 border"
                disabled={isSubmitting}
              >
                {isLoading ? <PropagateLoader color="#36d7b7" /> : 'Send'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default index;
