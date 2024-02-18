import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import { recurringTimer; cancelTimer } "mo:base/Timer";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Nat8 "mo:base/Nat8";
import Types "./Types";
import ICRCLedgerTypes "./universal.types";
import MgtCanisterTypes "./mgt_canister.types";

actor class ICPORTIFOLIO() = this {

  type ICPAddress = Types.ICPAddress;
  type DataType = Types.DataType;
  type CanisterMonitorType = Types.CanisterMonitorType;

  let ic : MgtCanisterTypes.Actor = actor ("aaaaa-aa");

  private var icpAddresses = TrieMap.TrieMap<Principal, List.List<ICPAddress>>(Principal.equal, Principal.hash);
  private var principalsToMonitor = TrieMap.TrieMap<Text, DataType>(Text.equal, Text.hash);
  private var ledgerCanistersToMonitor = TrieMap.TrieMap<Text, CanisterMonitorType>(Text.equal, Text.hash);

  private stable var icpAddressesArray : [(Principal, [ICPAddress])] = [];

  //add icp secondary address
  public shared ({ caller }) func addICPAddress(_nickName : Text, addr : Text) : async Result.Result<ICPAddress, Text> {
    switch (icpAddresses.get(caller)) {
      case (null) {
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        var list = List.nil<ICPAddress>();
        list := List.push<ICPAddress>(newAddr, list);
        icpAddresses.put(caller, list);
        return #ok(newAddr);
      };
      case (?value) {
        var list = value;
        let newAddr = {
          address = addr;
          nickName = _nickName;
        };
        list := List.push<ICPAddress>(newAddr, list);
        icpAddresses.put(caller, list);
        return #ok(newAddr);
      };
    };

  };

  //delete a secondary address from the list
  public shared ({ caller }) func deleteICPAdress(addr : Text) : async Result.Result<Text, Text> {
    switch (icpAddresses.get(caller)) {
      case null return #err("No addresses found");
      case (?value) {
        let newList = List.filter<ICPAddress>(value, func val { val.address != addr });
        icpAddresses.put(caller, newList);
        return #ok("Address deleted successfully");
      };
    };
  };

  //get all user icp addresses
  public func getAllUserICPAddresses(user : Principal) : async Result.Result<[ICPAddress], Text> {
    switch (icpAddresses.get(user)) {
      case (null) {

        return #ok([{
          address = Principal.toText(user);
          nickName = "Primary";
        }]);
      };
      case (?list) {
        var tempList = list;
        tempList := List.push<ICPAddress>(
          {
            address = Principal.toText(user);
            nickName = "Primary";
          },
          tempList,
        );
        return #ok(List.toArray<ICPAddress>(tempList));
      };
    };
  };

  //add a new principal to monitor
  public func addPrincipalToMonitor(principalID : Text, data : DataType) : async Result.Result<(), Text> {
    principalsToMonitor.put(principalID, data);
    return #ok();
  };

  //delete a principal from being monitored
  public func deletePrincipalToMonitor(principalID : Text) : async Result.Result<(), Text> {
    principalsToMonitor.delete(principalID);
    return #ok();
  };

  //get info about a specific principal being monitored
  public query func getPrincipalToMonitorInfo(principalID : Text) : async Result.Result<DataType, Text> {
    switch (principalsToMonitor.get(principalID)) {
      case null #err("ledger does not exist");
      case (?ledger) #ok(ledger);
    };
  };

  //add new ledger canister to be monitored
  public func addNewLedgerToMonitor(ledgerCanisterId : Text) : async Result.Result<(), Text> {

    try {
      //create a new ledger actor first,
      let tokenActor = actor (ledgerCanisterId) : ICRCLedgerTypes.Actor;

      //get the token name
      let tokenName = await tokenActor.icrc1_symbol();

      //get the latest transaction count,just put 1 as the starting block and 1 as the length.
      //in the response, it will return the real transaction length that we will use.

      let blockResults = await tokenActor.get_blocks({
        length = 1;
        start = 1;
      });

      //the latest transactions index is the chain_length-1 in the response,
      let _latestTransactionIndex = blockResults.chain_length -1;
      //save the data in the store
      ledgerCanistersToMonitor.put(
        ledgerCanisterId,
        {
          ledgerName = tokenName;
          latestTransactionIndex = _latestTransactionIndex;
        },
      );

      return #ok();
    } catch (error) {
      return #err(Error.message(error));
    };

  };

  //delete the ledger canister from being monitored
  public func deleteLedgerToMonitor(ledgerCanisterId : Text) : async Result.Result<(), Text> {
    ledgerCanistersToMonitor.delete(ledgerCanisterId);
    return #ok();
  };

  //get info about a specific ledger canister
  public query func getLegderInfo(ledgerCanisterId : Text) : async Result.Result<CanisterMonitorType, Text> {
    switch (ledgerCanistersToMonitor.get(ledgerCanisterId)) {
      case null #err("ledger does not exist");
      case (?ledger) #ok(ledger);
    };
  };

  //timer that should run every seconds or two
  public func startLedgerMonitor() : async Result.Result<Nat, Text> {
    let timer = recurringTimer(#seconds(5), monitorLedgers);
    return #ok(timer);
  };

  private func monitorLedgers() : async () {
    Debug.print(" ledger monitoring started");

    //loope through all the ledger canister ids
    for ((ledgerCanisterID, data) in ledgerCanistersToMonitor.entries()) {
      //for each ledger, create an actor
      //get the latest transaction
      let ledgerActor = actor (ledgerCanisterID) : ICRCLedgerTypes.Actor;

      let response = await ledgerActor.get_transactions({
        length = 1;
        start = Nat64.toNat(data.latestTransactionIndex);
      });

      Debug.print(" some progress on getting transactions");

      //check for the response to see if there is any transaction data
      if (Array.size(response.transactions) > 0) {
        //set the latest transation index to the first_index parameter in the repsonse
        Debug.print("updated the latest transactions index");
        Debug.print("current transaction index :" # Nat.toText(response.first_index));

        ledgerCanistersToMonitor.put(
          ledgerCanisterID,
          {
            ledgerName = data.ledgerName;
            latestTransactionIndex = data.latestTransactionIndex +1;
          },
        );

        //check if it is a transfer
        //for now, we are only focused on transfer, we will implement mint burn and approve later on
        switch (response.transactions[0].transfer) {
          case (?transfer) {

            let to = Principal.toText(transfer.to.owner);
            let from = Principal.toText(transfer.from.owner);
            let amount = Nat.toText(transfer.amount);

            Debug.print("finiished getting the from,to and amount parameters");
            //first check to see if the recipient has registered for notifications
            switch (principalsToMonitor.get(to)) {
              case (?entry) {
                Debug.print("the to is registered for notifications");

                //check to see if they are registered for specific token notifications
                if (Buffer.contains<Text>(Buffer.fromArray<Text>(entry.tokenNames), data.ledgerName, Text.equal)) {
                  //send the email
                  Debug.print("the to is registered for " # data.ledgerName # "notifications");

                  await sendEmailNotification(from, to, entry.emailAddress, data.ledgerName, amount);
                };

              };
              //if null, check to see if the sender has registered for notifications
              case (null) {
                switch (principalsToMonitor.get(from)) {
                  case (?entry) {
                    Debug.print("the to is registered for notifications");

                    //check to see if they are registered for specific token notifications
                    if (Buffer.contains<Text>(Buffer.fromArray<Text>(entry.tokenNames), data.ledgerName, Text.equal)) {
                      //send the email
                      Debug.print("the to is registered for " # data.ledgerName # "notifications");

                      await sendEmailNotification(from, to, entry.emailAddress, data.ledgerName, amount);
                    };

                  };
                  case (null) {};
                };

              };
            };

          };
          case (null) {};
        };

      };

    };

  };

  private func sendEmailNotification(tokenSender : Text, tokenReceiver : Text, emailAddress : Text, tokenName : Text, tokenAmount : Text) : async () {

    let url = "https://ic-netlify-functions.netlify.app/.netlify/functions/sendEmployeeEmail";

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key }

    ];

    let requestBodyJson : Text = "{ \"idempotencyKey\": \"" # idempotency_key # "\", \"email\": \"" # emailAddress # "\", \"token\": \"" # tokenName # "\", \"amount\": \"" # tokenAmount # "\", \"payer\": \"" # tokenSender # "\",\"owner\": \"" # tokenReceiver # "\"}";
    let requestBodyAsBlob : Blob = Text.encodeUtf8(requestBodyJson);
    let requestBodyAsNat8 : [Nat8] = Blob.toArray(requestBodyAsBlob);

    let http_request : MgtCanisterTypes.HttpRequestArgs = {
      url = url;
      max_response_bytes = null; //optional for request
      headers = request_headers;
      body = ?requestBodyAsNat8;
      method = #post;
      transform = null; //optional for request
    };

    Cycles.add(220_131_200_000); //minimum cycles needed to pass the CI tests. Cycles needed will vary on many things size of http response, subnetc, etc...).
    Debug.print(" sending the email");
    let http_response : MgtCanisterTypes.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);
    let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

  };
  func generateUUID() : Text {
    "UUID-123456789";
  };

  //section for creating the icrc token canisters programmatically

  //store the icrc1 ledger wasm
  stable var wasmContent : [Nat8] = [];

  //upload the wasm for the bot canister
  public func uploadWasm(wasmBlob : [Nat8]) : async Result.Result<(), Text> {
    try {
      wasmContent := wasmBlob;
      #ok();
    } catch (error) {
      #err(Error.message(error));
    };
  };

  //create new token
  public func createNewIcrc1Token(_args : [Nat8]) : async Result.Result<Text, Text> {

    let settings = {
      freezing_threshold = ?2_592_000;
      controllers = ?[Principal.fromActor(this)];
      memory_allocation = null;
      compute_allocation = null;
    };

    //add cycles to create an empty canister
    Cycles.add(100_000_000_000);
    let canister_id = await ic.create_canister({ settings = ?settings });

    let installSettings = {
      arg = [];
      wasm_module = wasmContent;
      mode = #install;
      canister_id = canister_id.canister_id;

    };

    Cycles.add(100_000_000_000);
    let depC = await ic.deposit_cycles(canister_id);

    //install the wasm code inside the wallet canister
    let insRes = await ic.install_code(installSettings);

    return #ok(Principal.toText(canister_id.canister_id));
  };

  //test the candid library
  public query func testCandid() : async [Nat8] {

    return [];
  };

};
