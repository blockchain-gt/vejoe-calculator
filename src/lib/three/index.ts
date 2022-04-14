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

export const provider = getDefaultProvider(rpc);

const bmc = new Contract(bmc_contract_address, bmc_abi, provider);
export const veJoeContract = new Contract(veJOE_addr, veJOE_abi, provider);

// export const WAVAX_USDC_contract = new Contract("0x454E67025631C065d3cFAD6d71E6892f74487a15", LP_abi)
export async function returnPairPrice(
  input: number,
  address: string,
  tokenOrder: boolean
) {
  const response = await getPairPrice(address);
  if (tokenOrder) {
    return input * response["pairs"][0].token1Price;
  } else {
    return input * response["pairs"][0].token0Price;
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

  const [token0Symbol, token0Name, token0Decimals] = await Promise.all([
    token0_contract.symbol(),
    token0_contract.name(),
    token0_contract.decimals(),
  ]);

  return {
    lpToken: data.lpToken,
    lpContract: data[0],
    token0: token0,
    token0Contract: token0_contract,
    token0Symbol,
    token0Name,
    token0Decimals,
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

  // console.log(totalJPS, totalAllocPoint);

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
  console.log(pid);
  let user_info = await bmc.userInfo(pid, wallet);
  console.log(user_info);
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
