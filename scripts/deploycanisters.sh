#!/bin/bash
# create the canisters on the local network
NETWORK="local"

#create the Chat-ledger canister
dfx canister create Chat_ledger --network "${NETWORK}"
dfx canister create ICP_ledger --network "${NETWORK}"
dfx canister create CkBtc_ledger --network "${NETWORK}"
#  dfx canister create CkBtc_minter --network "${NETWORK}"

dfx canister create CkBtc_index --network "${NETWORK}"
dfx canister create ICP_index --network "${NETWORK}"
dfx canister create Chat_index --network "${NETWORK}"

# dfx canister create monitorCanister --network "${NETWORK}"
# dfx canister create userCanister --network "${NETWORK}"
dfx canister create frontend --network "${NETWORK}"
dfx canister create backend --network "${NETWORK}"



## set the minter to the anonymous identity for testing purposes only
MINTERID="2vxsx-fae"
echo $MINTERID

## store the id of the ckbtc ledger
CKBTCLEDGERID="$(dfx canister id CkBtc_ledger --network "${NETWORK}")"
echo $CKBTCLEDGERID

PRINCIPAL="$(dfx identity get-principal)"
echo $PRINCIPAL
## store the id of the ckbtc minter
CKBTCMINTERID="$(dfx identity get-principal --network "${NETWORK}")"
echo $CKBTCMINTERID

##store the id of the chat ledger
CHATLEDGERID="$(dfx canister id Chat_ledger --network "${NETWORK}")"
echo $CHATLEDGERID

##store the id of the icp ledger
ICPLEDGERID="$(dfx canister id ICP_ledger --network "${NETWORK}")"
echo $ICPLEDGERID

## store the principal id of the cli user
dfx identity use testID

export MINTER_ACCOUNT_ID=$(dfx ledger account-id)

export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

## Deploy the ckBTC index canister
echo "Deploying the ckBTC Index canister"
dfx deploy --network "${NETWORK}" CkBtc_index --argument '
  record {
   ledger_id = (principal "'${CKBTCLEDGERID}'");
  }
' --mode=reinstall -y


## deploy the icp index canister
echo "Deploying the ICP Index canister"
dfx deploy --network "${NETWORK}" ICP_index --argument '
  record {
   ledger_id = (principal "'${ICPLEDGERID}'");
  }
' --mode=reinstall -y

## deploy the CHAT index canister
echo "Deploying the CHAT Index canister"
dfx deploy Chat_index --network "${NETWORK}" --argument '(
  record {
    ledger_id = principal "'${CHATLEDGERID}'"})
    ' --mode=reinstall -y



## deploy the chat ledger canister
echo "Step 2: deploying ICP_ledger canister..."
dfx deploy  ICP_ledger --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = 10_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt \"ICP\";
      token_name = opt \"Local ICP\";
    }
  })
" --mode=reinstall -y


## deploy the chat ledger canister
echo "Step 3: deploying Chat_ledger canister..."
dfx deploy --network "${NETWORK}" Chat_ledger --argument '
  (variant {
    Init = record {
      token_name = "Testnet Chat";
      token_symbol = "CHAT";
      minting_account = record { owner = principal "'${MINTERID}'";};
      initial_balances = vec { record { record { owner = principal "'${MINTERID}'";}; 100_000_000_000; }; };
      metadata = vec {};
      transfer_fee = 10;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${PRINCIPAL}'";
      }
    }
  })
' --mode=reinstall -y

## deploy the ckbtc ledger canister
echo "Step 6: deploying ckBtc_ledger canister......."
dfx deploy --network "${NETWORK}" CkBtc_ledger --argument '
  (variant {
    Init = record {
      token_name = "Testnet ckBTC";
      token_symbol = "ckBTC";
      minting_account = record { owner = principal "2vxsx-fae";};
      initial_balances = vec { record { record { owner = principal "'${MINTERID}'";}; 100_000_000_000; }; };
      metadata = vec {};
      transfer_fee = 10;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${PRINCIPAL}'";
      }
    }
  })
' --mode=reinstall -y

##deploy the internet identity canister
echo "Deploying the internet identity canister"
dfx deploy internet_identity --network "${NETWORK}"


echo "Deploying the backend canister"
##dfx deploy backend --network "${NETWORK}"
dfx deploy backend --network "${NETWORK}" 
##dfx deploy backend --network ic 

## it is important to provide the latest transaction from the blockchain in order to prevent the smart contract from processing old blocks
## start monitoring the ledger canisters right away. you need to manually start the monitoring servies for each of the ledger canisters

## Generate the .did files for all the canisters
echo "Generating .did files for the canisters"
dfx generate

## deploy the frontend canister
echo "Deploying the whole application on the network"
dfx deploy --network "${NETWORK}"

echo "Done with the deployment"




dfx canister --network local call Chat_ledger icrc1_transfer '
  (record {
    to=(record {
      owner=(principal "ewbs4-24msb-e266v-n77o7-trfif-w6mqf-pfqyt-y4k7v-n4vyj-czljs-7qe")
    });
    amount=90_000_000
  })
'



# txsrk-ebkng-zq2zz-x77go-anqz5-pcrm4-73555-j6uhl-5yavj-jiplp-3ae