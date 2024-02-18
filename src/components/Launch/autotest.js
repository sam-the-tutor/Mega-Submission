#!/usr/bin/env node

import {readFileSync} from 'fs';

import fetch from 'node-fetch';

import crypto from 'crypto';

import pkgPrincipal from '@dfinity/principal';
const {Principal} = pkgPrincipal;

import pkgIdentity from '@dfinity/identity';
const {Secp256k1KeyIdentity} = pkgIdentity;

import pkgAgent from '@dfinity/agent';
const {HttpAgent, Actor} = pkgAgent;

import {IDL} from '@dfinity/candid';

import {idlFactory} from '../../.dfx/local/canisters/manager/manager.did.mjs';

const managerPrincipal = () => {
  const buffer = readFileSync('./canister_ids.json');
  const {manager} = JSON.parse(buffer.toString('utf-8'));
  return Principal.fromText(manager.ic);
};

const initIdentity = () => {
  const buffer = readFileSync('/Users/daviddalbusco/.config/dfx/identity/default/identity.pem');
  const key = buffer.toString('utf-8');

  const privateKey = crypto.createHash('sha256').update(key).digest('base64');

  return Secp256k1KeyIdentity.fromSecretKey(Buffer.from(privateKey, 'base64'));
};

(async () => {
  try {
    const canisterId = managerPrincipal();

    const identity = initIdentity();

    const agent = new HttpAgent({identity, fetch, host: 'https://ic0.app'});

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId
    });

    const list = await actor.list('data');

    console.log({list});

    if (list.length <= 0) {
      return;
    }

    const {owner, bucketId} = list[0];

    const buffer = readFileSync(`${process.cwd()}/.dfx/local/canisters/data/data.wasm`);

    const arg = IDL.encode([IDL.Principal], [owner]);

    console.log(bucketId[0].toText());

    // TODO: bucketId[0] -> bucketId

    await actor.installCode(bucketId[0], [...arg], [...new Uint8Array(buffer)]);
  } catch (e) {
    console.error(e);
  }
})();









import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
// import useGetNftBalances from '../Hooks/useGetNftBalances'
import {IDL} from "@dfinity/candid"
const Launch = () => {
  // const { nftBalance } = useGetNftBalances()
  const { data: backendActor } = useQuery({
    queryKey: ['backendActor'],
  });

  const [file, setWasmFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        await backendActor?.uploadWasm(uint8Array).then((res) => {
          console.log('Wasm upload status : ', res);
        });

        // You can now use the Uint8Array as needed (e.g., send it to a server, process it, etc.)
      };
      reader.readAsArrayBuffer(selectedFile);
      setWasmFile(selectedFile);
    }
  };

  async function createNewToken() {
    try {

      const args=IDL.encode()
      const initArguments = {
        init: {
          send_whitelist: [],
          token_symbol: 'SML',
          transfer_fee: 10000,
          maximum_number_of_accounts: undefined,
          accounts_overflow_trim_quantity: undefined,
          transaction_window: undefined,
          max_message_size_bytes: undefined,
          icrc1_minting_account: undefined,
          archive_options: undefined,
          initial_values: [],
          token_name: 'SAMUEL',
          feature_flags: undefined,
        },
      };

      const encoder = new TextEncoder();
      const encoded = encoder.encode(JSON.stringify(initArguments));
      const uint8Array = Uint8Array.from(encoded);

      console.log('arguments in nat :', uint8Array);

      await backendActor?.createNewIcrc1Token([]).then((res) => {
        console.log('Wasm upload status : ', res);
      });
    } catch (error) {
      console.log('error in creating new token :', error);
    }
  }

  return (
    <div
      style={{ backgroundColor: '#2D3348', minHeight: '90vh' }}
      className="flex  w-full mt-10 justify-center items-center rounded-lg"
    >
      <div
        style={{ backgroundColor: '#11131f', height: '70vh' }}
        className="flex flex-col items-center rounded-lg gap-4 w-1/2"
      >
        <h2>token launcher test</h2>

        <div>
          <h2>File Upload and Convert to Uint8Array</h2>
          <input type="file" onChange={handleFileChange} />
          {file && <p>Selected File: {file.name}</p>}
        </div>
        <div>
          <button onClick={createNewToken}>Test</button>
        </div>
      </div>
    </div>
  );
};

export default Launch;








































































































































































































