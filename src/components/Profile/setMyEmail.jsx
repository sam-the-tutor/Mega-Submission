import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PropagateLoader } from 'react-spinners';
import { IoMdClose } from 'react-icons/io';

import { Principal } from '@dfinity/principal';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useGetInfo from '../../Hooks/useGetInfo';
import { Listbox } from '@headlessui/react';
function SaveEmailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { data: userAuthenticated } = useQuery({
    queryKey: ['isUserAuthenticated'],
  });
  const { data: backendActor } = useQuery({
    queryKey: ['backendActor'],
  });

  const options = ['CHAT', 'ckBTC', 'ICP'];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(
        selectedOptions.filter((selectedOption) => selectedOption !== option),
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  function handleButtonClick() {
    console.log(selectedOptions);
  }
  const { invalidateUserInfo } = useGetInfo();
  const { mutateAsync: HandleContribute } = useMutation({
    mutationFn: (data) => saveAccountDetails(data),
    onSuccess: async () => {
      await invalidateUserInfo();
      setIsLoading(false);
    },
  });

  async function saveAccountDetails(data) {
    try {
      if (!userAuthenticated || !backendActor) navigate('/');
      setIsLoading(true);

      return await backendActor?.addPrincipalToMonitor(data.principalID, {
        emailAddress: data.email_address,
        tokenNames: selectedOptions,
      });
    } catch (error) {
      console.log('error in saving email :', error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="submit"
        className="rounded-md border mt-4 shadow-md shadow-black w-full flex gap-1 p-1 hover:bg-yellow-500 justify-center items-center"
      >
        <IoAddCircleOutline color="yellow" />
        Notifications
      </button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
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
                initialValues={{ email_address: '', principalID: '' }}
                validate={(values) => {
                  const errors = {};

                  if (!values.email_address) {
                    errors.email_address = 'email address is required';
                  }
                  if (!values.principalID) {
                    errors.principalID = 'principal id is required';
                  }

                  return errors;
                }}
                //save the data in the backend
                onSubmit={(values, { setSubmitting }) => {
                  HandleContribute(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex  p-1 flex-col gap-1 w-3/4 justify-center items-center text-black">
                    <h1 className="mt-2 text-white border-b-2 pb-1 flex w-full justify-center items-center text-xl">
                      Set Up Email Notifications
                    </h1>
                    <div className="flex-col gap-1 w-full">
                      <label
                        htmlFor="email_address"
                        className="text-white text-left"
                      >
                        enter email address
                      </label>
                      <Field
                        type="text"
                        name="email_address"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="email_address"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>

                    <div className="flex-col gap-1 w-full">
                      <label
                        htmlFor="principalID"
                        className="text-white text-left"
                      >
                        enter principal id
                      </label>
                      <Field
                        type="text"
                        name="principalID"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="principalID"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>

                    <div className="flex flex-col justify-center w-full items-center">
                      <label
                        htmlFor="principalID"
                        className="text-white text-left"
                      >
                        select tokens
                      </label>
                      <div className="flex">
                        {options.map((option) => (
                          <div
                            key={option}
                            className={`${
                              selectedOptions.includes(option)
                                ? 'bg-blue-500 text-white te'
                                : 'bg-white text-black'
                            } border m-1 p-1 text-xs hover:cursor-pointer`}
                            onClick={() => handleOptionClick(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={{ boxShadow: 'red' }}
                      className="rounded-md text-white text-2xl border hover:bg-yellow-500 w-1/2 mb-4"
                    >
                      {isLoading ? <PropagateLoader color="#36d7b7" /> : 'save'}
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

export default SaveEmailModal;
