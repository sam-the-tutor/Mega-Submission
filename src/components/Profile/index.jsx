import React from 'react';
import {
  copyToClipboard,
  shorten17String,
  shortenString,
} from '../../Utils/Functions';
import { FaRegCopy } from 'react-icons/fa';
import UserIdTable from './UserIdTable';
// import SaveEmailModal from './setMyEmail';
// import SubscribeToNotifications from './Subscribe';
import { RxUpdate } from 'react-icons/rx';
import { useQuery } from '@tanstack/react-query';
import SaveEmailModal from './setMyEmail';
import AddNewModal from './AddNewModal';

const Profile = () => {
  const { data: principalID } = useQuery({
    queryKey: ['principal'],
  });

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
  });

  console.log('email in index :', userInfo);
  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className=" w-full mt-10 justify-center rounded-lg p-2"
    >
      <div className=" flex items-center justify-center p-4 text-xl border-b-2 uppercase">
        Settings
      </div>
      {/* principal ID, email and firebase */}
      <div className="flex w-full justify-evenly py-1 border rounded-sm">
        <div>
          <div className="flex flex-col rounded-lg p-2 justify-center">
            <h2 className="uppercase">Principal ID</h2>
            <div className="flex gap-2 justify-center items-center">
              <span>{shortenString(principalID)}</span>
              <FaRegCopy
                className="hover:cursor-pointer"
                onClick={() => copyToClipboard(principalID)}
              />
            </div>
          </div>
          <div className="flex flex-col items-center rounded-lg justify-center mb-2">
            <h2 className="uppercase ">Email Address</h2>
            <div className="flex gap-2 justify-center items-center">
              <span>{userInfo && userInfo?.emailAddress}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-lg justify-center">
          <h2 className="uppercase">Firebase</h2>
          <div className="flex gap-2 justify-center items-center">
            <span>coming soon...</span>
          </div>
          <button className="rounded-md border shadow-md shadow-black mt-4 flex gap-1 p-1 justify-center items-center hover:bg-yellow-500">
            <RxUpdate color="yellow" />
            Update
          </button>
        </div>
        <div className="flex flex-col rounded-lg justify-center">
          <h2 className="uppercase">Webhooks</h2>
          <div className="flex gap-2 justify-center items-center">
            <span>coming soon...</span>
          </div>
          <button className="rounded-md border shadow-md shadow-black mt-4 flex gap-1 p-1 justify-center items-center hover:bg-yellow-500">
            <RxUpdate color="yellow" />
            Update
          </button>
        </div>

        <div className="flex flex-col justify-center ">
          <AddNewModal />
          <SaveEmailModal />
        </div>
      </div>
      <div className="mt-8">
        <UserIdTable />
      </div>
    </div>
  );
};

export default Profile;
