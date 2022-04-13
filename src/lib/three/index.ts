import bmc_abi from "../abi/bmc_abi.json";
import JLP_abi from "../abi/JLP_abi.json";
import veJOE_abi from "../abi/veJOE_abi.json";
import ERC20_abi from "../abi/ERC20_abi.json";
import { BigNumber, Contract, getDefaultProvider } from "ethers";
import { LpOption } from "./types";
import { SECONDS_PER_YEAR } from "../constants";
import { getPairPrice } from "../pairs";

export const wallet = "0x1E61E337B218b103D599a6C7495E959dB0A5d287";
const bmc_contract_address = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F";
const veJOE_addr = "0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456";

const rpc = "https://api.avax.network/ext/bc/C/rpc";

const provider = getDefaultProvider(rpc);

const bmc = new Contract(bmc_contract_address, bmc_abi, provider);
export const veJoeContract = new Contract(veJOE_addr, veJOE_abi, provider);

const LP_abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sync","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
// export const WAVAX_USDC_contract = new Contract("0x454E67025631C065d3cFAD6d71E6892f74487a15", LP_abi)
export async function returnPairPrice(input: number, address: string, tokenOrder: boolean) {
  const response = await getPairPrice(address);
  console.log(response);
  if (tokenOrder) {
    return input * response['pairs'][0].token1Price;
  } else {
    return input * response['pairs'][0].token0Price;
  }
}


async function getLP(pid: number) {
  let data = await bmc.poolInfo(pid);
  let JLP_contract = new Contract(data.lpToken, JLP_abi, provider);

  let token0Promise = JLP_contract.token0();
  let token1Promise = JLP_contract.token1();

  const [token0, token1] = await Promise.all([token0Promise, token1Promise]);

  let token0_contract = new Contract(token0, ERC20_abi, provider);
  let token1_contract = new Contract(token1, ERC20_abi, provider);

  return {
    lpToken: data.lpToken,
    lpContract: data[0],
    token0: token0,
    token0Contract: token0_contract,
    token0Symbol: await token0_contract.symbol(),
    token0Name: await token0_contract.name(),
    token0Decimals: await token0_contract.decimals(),
    token1: token1,
    token1Contract: token1_contract,
    token1Symbol: await token1_contract.symbol(),
    token1Name: await token1_contract.name(),
    token1Decimals: await token1_contract.decimals(),
    totalSupply: data.totalLpSupply,
    totalFactor: data.totalFactor,
    reserves: await JLP_contract.getReserves(),
    allocPoint: data.allocPoint,
  };
}

export let totalJPS: BigNumber;
export let totalAllocPoint: BigNumber;

export async function getLPs() {
  [totalJPS, totalAllocPoint] = await Promise.all([
    bmc.joePerSec(),
    bmc.totalAllocPoint(),
  ]);

  console.log(totalJPS, totalAllocPoint);

  let num_pools = await bmc.poolLength();
  let pid = 0;
  let pool_data = [];
  while (pid < num_pools) {
    pool_data.push(getLP(pid));
    pid++;
  }
  return Promise.all(pool_data);
}

export async function getUserInfo(
  pid: number,
  wallet: string,
  pool_data: LpOption["poolData"]
) {
  let user_info = await bmc.userInfo(pid, wallet);
  let user_liquidity = user_info.amount;
  let pool_total_liquidity = pool_data.totalSupply;

  return 100 * (user_liquidity / pool_total_liquidity);
}
export async function getUserJLPBalance(
  pid: number,
  wallet: string,
  pool_data: LpOption["poolData"]
) {
  let user_info = await bmc.userInfo(pid, wallet);
  return user_info.amount;
}

export function getBaseAPR(
  totalJPS: BigNumber,
  totalAllocPoint: BigNumber,
  jlpBalance: number,
  selectedPool: LpOption
) {
  const poolJPS =
    //@ts-ignore
    (totalJPS * selectedPool?.poolData.allocPoint) / totalAllocPoint;

  return (
    (SECONDS_PER_YEAR * (poolJPS * jlpBalance * 0.6)) /
    selectedPool.poolData.totalSupply
  );
}

export function getBoostedAPR(
  totalJPS: BigNumber,
  totalAllocPoint: BigNumber,
  jlpBalance: number,
  selectedPool: LpOption,
  veJoeBalance: number
) {
  const poolJPS =
    //@ts-ignore
    (totalJPS * selectedPool?.poolData.allocPoint) / totalAllocPoint;

  return (
    SECONDS_PER_YEAR *
    (((jlpBalance * veJoeBalance) ** 0.5 * poolJPS * 0.4) /
      //@ts-ignore
      selectedPool.poolData.totalFactor)
  );
}

