import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PropagateLoader } from 'react-spinners';
import { IoMdClose } from 'react-icons/io';

import { IoAdd } from 'react-icons/io5';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGetInfo from '../../Hooks/useGetInfo';
import { useNavigate } from 'react-router-dom';
import useGetTokenBalances from '../../Hooks/useGetTokenBalances';
function AddNewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userAuthenticated } = useQuery({
    queryKey: ['isUserAuthenticated'],
  });
  const { data: backendActor } = useQuery({
    queryKey: ['backendActor'],
  });

  async function saveNewAddress(data) {
    try {
      if (!userAuthenticated || !backendActor) navigate('/');
      setIsLoading(true);

      return await backendActor?.addICPAddress(data.nickName, data.princID);
    } catch (error) {
      console.log('error in adding new address :', error);
    }
  }

  const { invalidateUserAddresses } = useGetInfo();
  const { invalidateUserTokenData } = useGetTokenBalances();

  const { mutateAsync: HandleAddNewAddress } = useMutation({
    mutationFn: (data) => saveNewAddress(data),
    onSuccess: async () => {
      await invalidateUserAddresses();
      setIsLoading(false);
      await invalidateUserTokenData();
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="submit"
        className="rounded-md border mt-4 shadow-md shadow-black flex gap-1 p-1 hover:bg-yellow-500 items-center"
      >
        <IoAdd className="text-left" size={20} color="yellow" />
        <div>New ID</div>
      </button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto w-full ">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity"
              aria-hidden="true"
            ></div>
            <div
              style={{ backgroundColor: '#11131f' }}
              className="rounded-lg overflow-hidden relative shadow-xl flex flex-col justify-center items-center transform transition-all sm:max-w-md sm:w-full"
            >
              <div className="mt-2 flex w-full justify-end mr-6">
                <IoMdClose
                  size={25}
                  className="hover:cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <Formik
                initialValues={{ nickName: '', princID: '' }}
                validate={(values) => {
                  const errors = {};

                  if (!values.nickName) {
                    errors.nickName = 'nickname is required';
                  }
                  if (!values.princID) {
                    errors.princID = 'principal id is required';
                  }

                  return errors;
                }}
                //save the data in the backend
                onSubmit={(values, { setSubmitting }) => {
                  HandleAddNewAddress(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex  p-6 flex-col gap-4 w-3/4 justify-center items-center text-black">
                    <h1 className="mt-2 text-white border-b-2 pb-1 flex w-full justify-center items-center text-xl">
                      Add New Account
                    </h1>
                    <div className="flex-col gap-1 w-full">
                      <label
                        htmlFor="nickName"
                        className="text-white text-left"
                      >
                        enter nickname
                      </label>
                      <Field
                        type="text"
                        name="nickName"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="nickName"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>
                    <div className="flex-col gap-1 w-full">
                      <label htmlFor="princID" className="text-white">
                        enter principal id
                      </label>
                      <Field
                        type="text"
                        name="princID"
                        className="rounded-md h-8 text-black w-full"
                      />
                      <ErrorMessage
                        name="princID"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        boxShadow: '0px 2px transparent',
                      }}
                      className="rounded-md border text-white text-2xl hover:bg-yellow-500 w-1/2 mb-4"
                    >
                      {isLoading ? <PropagateLoader color="#36d7b7" /> : 'Save'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddNewModal;
