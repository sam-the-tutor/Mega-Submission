export const monitor_idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const Result = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Test = IDL.Service({
    addNewSubscriber: IDL.Func([IDL.Text], [Result_1], []),
    startLedgerMonitor: IDL.Func([IDL.Nat, IDL.Text], [Result], []),
  });
  return Test;
};
export const init = ({ IDL }) => {
  return [];
};
