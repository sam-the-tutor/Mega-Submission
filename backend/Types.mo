import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";

module {
  public type ICPAddress = {
    address : Text;
    nickName : Text;
  };
  public type DataType = {
    emailAddress : Text;
    tokenNames : [Text];
  };

  public type CanisterMonitorType = {
    ledgerName : Text;
    latestTransactionIndex : Nat64;
  };

};
