import bmc_abi from "../abi/bmc_abi.json";
import JLP_abi from "../abi/JLP_abi.json";
import veJOE_abi from "../abi/veJOE_abi.json";
import ERC20_abi from "../abi/ERC20_abi.json";

import lpData from "../data/lps.json";
import { BigNumber, Contract, getDefaultProvider } from "ethers";
import { LpOption } from "./types";
import { GraphQLClient, gql } from "graphql-request";

//Provider
const rpc = "https://api.avax.network/ext/bc/C/rpc";
const provider = getDefaultProvider(rpc);

//VeJoe Contract
const veJOE_addr = "0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456";
export const veJoeContract = new Contract(veJOE_addr, veJOE_abi, provider);

//Boostedt Master Chef Contract
const bmc_contract_address = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F";
const bmc = new Contract(bmc_contract_address, bmc_abi, provider);

export const wallet = "0x0000000000000000000000000000000000000000";
const SECONDS_PER_YEAR = 31536000;


const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange",
  {
    headers: {},
  }
);
export async function getReserves(poolData: LpOption["poolData"]) {
  const contract = new Contract(poolData.lpToken, JLP_abi, provider);
  const reserves = await contract.getReserves();
  return reserves;
}
/*  See methodology in JLPcontract.sol
 *   @param pool_data: LpOption[] struct defining characteristics of token pool
 *   @param amount0: input of textfield mapped to token0
 *   @param amount1: input of textfield mapped to token1
 *    O(1)
 */
export function getIssuance(
  pool_data: LpOption["poolData"],
  bal: number,
  reserves: any
): { token0: number; token1: number } {
  // (JLPBalance / totalSupply / 2) * reserves[0] / token0dec
  const token0 =
    ((bal / pool_data.totalSupply) * reserves[0]) /
    10 ** Number.parseInt(pool_data.token0Decimals);
  // (JLPBalance / totalSupply / 2) * reserves[1] / token1dec
  const token1 =
    ((bal / pool_data.totalSupply) * reserves[1]) /
    10 ** Number.parseInt(pool_data.token1Decimals);
  return { token0: token0, token1: token1 };
}

// O(1)
export function revertToJLP(
  pool_data: LpOption["poolData"],
  amount0: number,
  amount1: number,
  reserves: any
) {
  // (JLPBalance / totalSupply / 2) * reserves[0] / token0dec
  const liquidity = Math.min(
    (amount0 * 10 ** Number.parseInt(pool_data.token0Decimals)) / reserves[0],
    (amount1 * 10 ** Number.parseInt(pool_data.token1Decimals)) / reserves[1]
  );
  return liquidity * pool_data.totalSupply;
}

export const getJoePrice = async () => {
  const query = gql`
    query {
      pairs(where: { id: "0x3bc40d4307cd946157447cd55d70ee7495ba6140" }) {
        id
        name
        token1Price
      }
    }
  `;
  const response = await client.request(query);
  return response.pairs[0].token1Price;
};

export async function getPairPrice(address: string) {
  if (typeof address === "undefined") return;
  const query = gql`
    query {
        pairs(where: {id: "${address.toLowerCase()}" }) {
        id
        name
        token0Price
        token1Price
        reserveUSD
        }
    }
    `;
  const response = await client.request(query);
  return response;
}

export async function returnPairPrice(
  input: number,
  address: string,
  tokenOrder: boolean
) {
  const response = await getPairPrice(address);
  if (typeof response === "undefined") return 0;
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

  const [
    token0Symbol,
    token0Name,
    token0Decimals,
    token1Symbol,
    token1Name,
    token1Decimals,
    reserves,
  ] = await Promise.all([
    token0_contract.symbol(),
    token0_contract.name(),
    token0_contract.decimals(),
    token1_contract.symbol(),
    token1_contract.name(),
    token1_contract.decimals(),
    JLP_contract.getReserves(),
  ]);

  return {
    lpToken: data.lpToken,
    lpContract: data[0],
    token0: token0,
    token0Symbol,
    token0Name,
    token0Decimals,
    token1: token1,
    token1Symbol,
    token1Name,
    token1Decimals,
    totalSupply: data.totalLpSupply,
    totalFactor: data.totalFactor,
    reserves,
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
  return lpData;
  // console.log(lpData);

  console.log(totalJPS, totalAllocPoint);
  let num_pools = await bmc.poolLength();
  let pid = 0;
  let pool_data = [];
  while (pid < num_pools) {
    pool_data.push(getLP(pid));
    pid++;
  }
  const allData = await Promise.all(pool_data);
  console.log(allData);

  return allData;
}

export async function getPoolInfo(pid: number, wallet: string) {
  let user_info = await bmc.userInfo(pid, wallet);
  return user_info;
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
export async function getUserJLPBalance(pid: number, wallet: string) {
  let user_info = await bmc.userInfo(pid, wallet);
  return user_info.amount;
}

export function getBaseAPR(
  totalJPS: BigNumber,
  totalAllocPoint: BigNumber,
  jlpBalance: number,
  selectedPool: LpOption,
  joePrice: number,
  posValue: number
) {
  if (jlpBalance === 0) return 0;

  const poolJPS =
    //@ts-ignore
    (totalJPS * selectedPool?.poolData.allocPoint) / totalAllocPoint;
  const rewardsPerSecond =
    (poolJPS * jlpBalance * 0.6) / selectedPool.poolData.totalSupply / 1e18;
  const rewardsPerYear = rewardsPerSecond * SECONDS_PER_YEAR;
  const rewardsPerYearUSD = rewardsPerYear * joePrice;
  const APR = (rewardsPerYearUSD / posValue) * 100;
  return Number.isNaN(APR) || !Number.isFinite(APR) ? 0 : APR;
}

export function getBoostedAPR(
  totalJPS: BigNumber,
  totalAllocPoint: BigNumber,
  jlpBalance: number,
  selectedPool: LpOption,
  veJoeBalance: number,
  joePrice: number,
  posValue: number
) {
  if (jlpBalance === 0) return 0;
  const poolJPS =
    //@ts-ignore
    (totalJPS * selectedPool?.poolData.allocPoint) / totalAllocPoint;
  const numerator = ((jlpBalance * veJoeBalance) ** 0.5 * poolJPS * 0.4) / 1e9;
  const JPS = numerator / selectedPool.poolData.totalFactor;
  const JPY = JPS * SECONDS_PER_YEAR;
  const rewardsPerYearUSD = JPY * joePrice;
  const APR = (rewardsPerYearUSD / posValue) * 100;
  return Number.isNaN(APR) ? 0 : APR;
}

export async function getInitialLpTVL() {
  return (await getPairPrice(lpData[0].lpToken)).pairs[0].reserveUSD
}