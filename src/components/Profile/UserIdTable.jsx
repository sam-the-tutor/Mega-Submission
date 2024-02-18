import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useGetInfo from '../../Hooks/useGetInfo';

const UserIdTable = () => {
  const { invalidateUserAddresses } = useGetInfo();

  const { data: storedUserIDS } = useQuery({
    queryKey: ['userPrincipalAddresses'],
  });

  const { data: principalID } = useQuery({
    queryKey: ['principal'],
  });
  const { data: userAuthenticated } = useQuery({
    queryKey: ['isUserAuthenticated'],
  });
  const { data: backendActor } = useQuery({
    queryKey: ['backendActor'],
  });

  const { mutateAsync: HandleDeleteAddress } = useMutation({
    mutationFn: (data) => deleteAddress(data),
    onSuccess: async () => {
      await invalidateUserAddresses();
    },
  });

  async function deleteAddress(id) {
    try {
      if (!userAuthenticated || !backendActor || !principalID) navigate('/');

      return await backendActor?.deleteICPAdress(id);
    } catch (error) {
      console.log('error in deleting icp address :', error);
    }
  }

  console.log('user ids :', storedUserIDS);
  return (
    // <div
    //   style={{ backgroundColor: '#11131f', height: '370px' }}
    //   className="overflow-x-auto rounded-lg w-full pt-4 flex justify-center"
    // >
    <table
      style={{ backgroundColor: '#11131f' }}
      className="min-w-full divide-y divide-gray-200 rounded-lg"
    >
      <thead>
        <tr>
          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Nickname
          </th>
          <th className="px-2 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            Principal ID
          </th>
          <th className="px-2 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="flex-col justify-star w-full">
        {storedUserIDS &&
          storedUserIDS?.map((token) => (
            <tr key={token.address}>
              <td className="flex px-6 py-4 text-left">{token.nickName}</td>
              <td className="text-center flex-col px-10">{token.address}</td>
              <td className="text-left flex-col px-0">
                {token.nickName === 'Primary' ? null : (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this ID?',
                        )
                      ) {
                        HandleDeleteAddress(token.address);
                      }
                    }}
                    className="bg-red-500 p-2 rounded-md"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    // </div>
  );
};

export default UserIdTable;
