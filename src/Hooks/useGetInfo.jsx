import { Principal } from '@dfinity/principal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

const useGetInfo = () => {
  const queryClient = useQueryClient();
  const { data: principal } = useQuery({
    queryKey: ['principal'],
  });
  const { data: userAuthenticated } = useQuery({
    queryKey: ['isUserAuthenticated'],
  });
  const { data: backendActor } = useQuery({
    queryKey: ['backendActor'],
  });

  async function loadUserAddresses() {
    if (!userAuthenticated || !backendActor) return { err: 'not allowed' };
    const results = await backendActor?.getAllUserICPAddresses(
      Principal.fromText(principal?.toString()),
    );
    await queryClient.setQueryData(['userPrincipalAddresses'], results?.ok);
    return results?.ok;
  }

  async function loadUserInfo() {
    if (!userAuthenticated || !backendActor) return { err: 'not allowed' };
    const results = await backendActor?.getPrincipalToMonitorInfo(
      principal?.toString(),
    );
    await queryClient.setQueryData(['userInfo'], results?.ok);
    return results?.ok;
  }

  const info = useQuery({
    queryKey: ['userInfo'],
    enabled: userAuthenticated,
    queryFn: loadUserInfo(),
  });

  const principalResults = useQuery({
    queryKey: ['userPrincipalAddresses'],
    enabled: userAuthenticated,
    queryFn: () => loadUserAddresses(),
  });

  //invalidate userInfo
  async function invalidateUserInfo() {
    await queryClient.invalidateQueries(['userInfo']);
  }

  //invalidate userInfo
  async function invalidateUserAddresses() {
    await queryClient.invalidateQueries(['userPrincipalAddresses']);
  }

  return {
    loadUserInfo,
    loadUserAddresses,
    invalidateUserInfo,
    invalidateUserAddresses,
  };
};
export default useGetInfo;
