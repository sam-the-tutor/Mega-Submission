import { canisterId as CHATLedger } from '../declarations/Chat_ledger';
import { canisterId as ckBTCLedger } from '../declarations/CkBtc_ledger';
import { canisterId as ICPLedger } from '../declarations/ICP_ledger';
// import { canisterId as ckETHLegder } from '../../declarations/CkETH_ledger';

import { canisterId as ChatIndexCanister } from '../declarations/Chat_index';
import { canisterId as ckBTCIndexCanister } from '../declarations/CkBtc_index';
import { canisterId as IcpIndexCanister } from '../declarations/ICP_index';
// import { canisterId as ckETHIndexCanister } from '../../declarations/CkETH_index';
export const CanisterIDS = [CHATLedger, ckBTCLedger, ICPLedger];

export const IndexCanisters = [
  ckBTCIndexCanister,
  ChatIndexCanister,
  IcpIndexCanister,
];

export function getLocalCanisterID(token) {
  let text;
  switch (token) {
    case 'ckBTC':
      text = ckBTCLedger;
      break;
    case 'ICP':
      text = ICPLedger;
      break;
    case 'CHAT':
      text = CHATLedger;
      break;
    default:
      //for ckBTC
      text = CHATLedger;
  }

  return text;
}

export function getLocalIndexCanisterID(token) {
  let text;
  switch (token) {
    case 'ckBTC':
      text = ckBTCIndexCanister;
      break;
    case 'ICP':
      text = IcpIndexCanister;
      break;
    // case 'ckETH':
    //   text = ckETHIndexCanister;
    //   break;
    case 'CHAT':
      text = ChatIndexCanister;
      break;
    default:
      //for ckBTC
      text = ckBTCIndexCanister;
  }
  return text;
}

//this transforms the balances of the user by calculating
export function transformDataArray(dataArray) {
  try {
    if (!dataArray) return;
    const formattedPrices = {};
    for (const data of dataArray) {
      const user = data.principal_id;
      const tokens = data.balances;
      for (const token of tokens) {
        const tokenSymbol = token.token_symbol;
        if (!formattedPrices[tokenSymbol]) {
          formattedPrices[tokenSymbol] = 0;
        }
        formattedPrices[tokenSymbol] += Number(token.amount) / 10 ** 8;
      }
    }

    return formattedPrices;
  } catch (e) {
    console.log('error in transforming data array :', e);
  }
}

function transformData(data) {
  const result = {};
  for (let i = 0; i < data.length; i++) {
    const key = data[i][1];
    const value = data[i][2];
    result[key] = value;
  }
  return result;
}



export function ProcessData(dataArray,tokenPriceData) {
  console.log("Portfolio datA icp :", dataArray);

  const realData = transformData(tokenPriceData);
  const tokenBalances = {};

  
  for (const symbol in realData) {
    const key = symbol.split("/")[0];
    tokenBalances[key] = {
      balance: 0,
      value: 0,
      percentage: 0,
      addresses: [],
    };
  }
  
  console.log("Here2 os the stuff :", tokenBalances);

  console.log('token address balances :', dataArray)
  // loop through each address
  for (const data of dataArray) {
    const address = data.principal_id;
    const tokens = data.balances;

    // loop through each token held by the address
    for (const token of tokens) {
      const symbol = token.token_symbol;

      // add the balance to the corresponding token balance
      if (tokenBalances[symbol]) {
        tokenBalances[symbol].balance += Number(token.amount) / 10 ** 8;
      } else {
        tokenBalances[symbol].balance = Number(token.amount) / 10 ** 8;
      }
    }
  }

  let totalValue = 0;

  // loop through each token and calculate the total value
  for (const symbol in tokenBalances) {
    const balance = tokenBalances[symbol].balance;
    const tokenName = symbol + "/USD";
    const price = realData[tokenName];
    const value = Number(balance) * price;
    tokenBalances[symbol].value = value;
    totalValue += value;
  }

  //loop through eack token and calculate the percentage and add the addresses
  for (const symbol in tokenBalances) {
    const value = tokenBalances[symbol].value;
    const percentage = (value / totalValue) * 100;
    const addresses = tokenBalances[symbol].addresses;
    //need to see if the address holds the required token before adding it to the list of holders
    tokenBalances[symbol] = {
      balance: tokenBalances[symbol].balance,
      value,
      percentage,
      addresses,
    };
  }
  // loop through each address and add it to the corresponding token if it has a balance of the corresponding token
  for (const data of dataArray) {
    const address = data.principal_id;
    const tokens = data.balances;
    for (const token of tokens) {
      const symbol = token.token_symbol;
      if (token.amount > 0) {
        tokenBalances[symbol].addresses.push(address);
      }
    }
  }

  const filteredTokenBalances = Object.fromEntries(
    Object.entries(tokenBalances).filter(
      ([symbol, { balance, value }]) => balance !== 0 && value !== 0
    )
  );
  return {
    tokenHoldings: filteredTokenBalances,
    totalPortfolioValue: totalValue,
  };
}





export async function getUserICPNetWorth(tokenPrices, realHolding) {
  const { totalPortfolioValue, formattedPrices } =
    await calculateFinalPortfolio(realHolding, tokenPrices);

  return { totalPortfolioValue, formattedPrices };
}

export async function calculateFinalPortfolio(formattedPrices, tokenPrices) {
  const portfolioValue = {};
  for (const [key, value] of Object.entries(formattedPrices)) {
    const tokenName = key + "/USD";
    const tokenPrice = tokenPrices.find((price) => price[1] === tokenName);
    const valueInDollars = formattedPrices[key] * tokenPrice[2];

    portfolioValue[key] = valueInDollars;
  }
  const totalPortfolioValue = Object.values(portfolioValue).reduce(
    (totalValue, price) => totalValue + price,
    0
  );

  return {
    totalPortfolioValue,
    formattedPrices,
  };
}





export function fixDecimals(num) {
  if(num ===undefined) return
  let decimalPart = (num + '').split('.')[1];
  if (decimalPart === '0' || !decimalPart) {
    return num.toFixed(0);
  } else {
    return num.toFixed(3);
  }
}

export function transformTransactionArray(transactions) {
  //   const formattedPrices = [];
  var userTransactions = [];

  for (const trans of transactions) {
    var transKind;
    var transAmount;
    var transFrom;
    var transTo;
    var timeStamp;
    var transactionId;
    // if (trans.transaction.kind !== "") {
    //   transKind = trans.transaction.kind;
    //   transAmount = trans.transaction.transfer[0].amount;
    //   transFrom = trans.transaction.transfer[0].from;
    //   transTo = trans.transaction.transfer[0].to;
    //   timeStamp = trans.transaction.transfer[0].created_at_time[0];
    // } else
    if (trans.transaction.mint.length != +0) {
      transactionId = trans.id;
      transKind = 'mint';
      transAmount = trans.transaction.mint[0].amount;
      transFrom = 'mintAccount';
      transTo = trans.transaction.mint[0].to.owner.toString();
      timeStamp = trans.transaction.mint[0].created_at_time[0];
    } else if (trans.transaction.burn.length !== 0) {
      transKind = 'burn';
      transactionId = trans.id;
      transAmount = trans.transaction.burn[0].amount;
      transFrom = trans.transaction.burn[0].from.owner.toString();
      transTo = 'mintAccount';
      timeStamp = trans.transaction.burn[0].created_at_time[0];
    } else if (trans.transaction.transfer.length !== 0) {
      transKind = 'transfer';
      transactionId = trans.id;
      transAmount = trans.transaction.transfer[0].amount;
      transFrom = trans.transaction.transfer[0].from.owner.toString();
      transTo = trans.transaction.transfer[0].to.owner.toString();
      timeStamp = trans.transaction.transfer[0].created_at_time[0];
    }

    userTransactions.push({
      kind: transKind,
      amount: Number(transAmount) / 1e9,
      from: transFrom,
      to: transTo,
      timestamp: timeStamp,
      id: Number(transactionId),
    });
  }
  return userTransactions;
}

export function shortenString(str) {
  if (!str) return;
  if (str.length <= 11) {
    return str;
  } else {
    let firstPart = str.substring(0, 10);
    let lastPart = str.substring(str.length - 4);
    return `${firstPart}...${lastPart}`;
  }
}

export function shorten17String(str) {
  if (!str) return;
  if (str.length <= 11) {
    return str;
  } else {
    let firstPart = str.substring(0, 20);
    let lastPart = str.substring(str.length - 4);
    return `${firstPart}...${lastPart}`;
  }
}

export function formatExtendedTokenData(tokenName, extendedData) {
  try {
    let rates = [];
    let d = extendedData.map((x) => {
      let supply = x?.last
        ? x.last.circulating_supply / 10 ** x.config.decimals
        : 0;
      let price = x.rates?.find((q) => q.to_token === '0');
      if (price) price = price.rate;
      else price = 0;
      let volume = x.rates.find((x) => x.to_token === '0').volume;
      let depth2 = x.rates.find((x) => x.to_token === '0').depth2;
      let depth8 = x.rates.find((x) => x.to_token === '0').depth8;
      let depth50 = x.rates.find((x) => x.to_token === '0').depth50;

      let total = Number((x.last?.total_supply || 0) / 10 ** x.config.decimals);
      rates.push(...x.rates?.map((a) => ({ pair: a.symbol, rate: a.rate })));
      let sns = 'sns' in x.config.locking ? 'SNS' : '';
      return {
        sns,
        symbol: x.config.symbol,
        circulating:
          supply + ' | ' + ((Number(supply) * 100) / total).toFixed(1) + '%',
        price_USD: price.toFixed(6),
        marketcap_USD: Number(supply) * price,
        volume_USD: volume.toFixed(0),
        total: total.toLocaleString(),
        depth2: depth2.toFixed(0),
        depth8: depth8.toFixed(0),
        depth50: depth50.toFixed(0),
        treasury: (
          (x.last?.treasury || 0) /
          10 ** x.config.decimals
        ).toLocaleString(),
        treasuryICP: (x.last?.other_treasuries[0]
          ? x.last?.other_treasuries[0][1] / 10 ** 8
          : 0
        ).toLocaleString(),
        dissolving_1d_USD: Math.round(
          Number((x.last?.dissolving_1d || 0) / 10 ** x.config.decimals) *
            price,
        ).toLocaleString(),
        dissolving_30d_USD: Math.round(
          Number((x.last?.dissolving_30d || 0) / 10 ** x.config.decimals) *
            price,
        ).toLocaleString(),
        dissolving_1y_USD: Math.round(
          Number((x.last?.dissolving_1y || 0) / 10 ** x.config.decimals) *
            price,
        ).toLocaleString(),
      };
    });
    // d = d.filter(a => (a.symbol != 'OGY') && (a.symbol != 'ICP') && (a.symbol != "OT"))
    d = d.sort((a, b) => b.marketcap_USD - a.marketcap_USD);
    d = d.map((x) => ({
      ...x,
      marketcap_USD: Math.round(x.marketcap_USD).toLocaleString(),
    }));

    const filtered = d.filter((token) => token.symbol === tokenName);

    console.log('extended data :', filtered);
    console.log('Rate data :', rates);
    return filtered;
  } catch (e) {
    console.log('error in extended :', e);
  }
}



export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard :', text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

 export function getIndividualIdHoldings(token_symbol, data) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].balances.length; j++) {
      if (data[i].balances[j].token_symbol === token_symbol) {
        result.push({
          principal_id: data[i].principal_id,
          amount: data[i].balances[j].amount / (10 ** data[i].balances[j].token_decimals),
        });
      }
    }
  }
  return result;
}
