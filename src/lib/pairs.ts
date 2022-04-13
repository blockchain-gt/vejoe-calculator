/* only dependency is "graphql-request"
 * run with "node pairs.js"
 * Tokens: WAVAX, WETH.e, WBTC.e, JOE, LINK.e, BNB
 * The rest are stablecoins.
 */


import { LpOption } from "./three/types";
import { GraphQLClient, gql } from "graphql-request";
import { Contract } from "ethers";
import { LP_abi } from "./three";
import { provider } from "./three";
const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange",
  {
    headers: {},
  }
);
export async function getIssuance(pool_data: LpOption["poolData"], amount0: number, amount1: number) {
  const token0_name = pool_data.token0Symbol;
  if (token0_name === "WTBC.e") {
    amount0 *= 10e8; //WTBC.e is the only token that uses 8 decimals
  } else if (token0_name === "USDT.e" || token0_name === "USDC" || token0_name === "USDC.e") {
    amount0 *= 10e6; //Stablecoins use 6 decimals
    amount0 = Math.round(amount0);
  } else {
    amount0 *= 10e18; //Normal coins use 18 decimals
  }
  const token1_name = pool_data.token1Symbol;
  if (token1_name === "WTBC.e") {
    amount1 *= 10e8; //WTBC.e is the only token that uses 8 decimals
  } else if (token1_name === "USDT.e" || token1_name === "USDC" || token1_name === "USDC.e") {
    amount1 *= 10e6; //Stablecoins use 6 decimals
    amount1 = Math.round(amount1);
  } else {
    amount1 *= 10e18; //Normal coins use 18 decimals
  }


  const contract = new Contract(pool_data.lpContract, LP_abi, provider);
  const reserves = await contract.getReserves();
  const liquidity = Math.min(
    amount0 / reserves[0],
    amount1 / reserves[1]
  )
  // console.log(amount0 / reserves[0]);
  // console.log(amount1 / reserves[1]);
  // console.log(amount0 / reserves[0] * pool_data.totalSupply);
  return liquidity * pool_data.totalSupply / 10e18;
}
export async function getPairPrice(address: string) {
  const query = gql`
    query {
        pairs(where: {id: "${address.toLowerCase()}" }) {
        id
        name
        token0Price
        token1Price
        }
    }
    `;
  const response = await client.request(query);
  return response;
}

async function getPrices() {
  const WAVAXPromise = getPairPrice(
    "0xf4003f4efbe8691b60249e6afbd307abe7758adb"
  );
  const JOEPromise = getPairPrice("0x3bc40d4307cd946157447cd55d70ee7495ba6140");
  const WETHPromise = getPairPrice(
    "0x9a166ae3d4c3c2a7febfae86d16896933f4e10a9"
  );
  const WBTCPromise = getPairPrice(
    "0x66ab843d86ad296ed1953c179d9ce2bb587ff2aa"
  );

  const [WAVAX, JOE, WETH, WBTC] = await Promise.all([
    WAVAXPromise,
    JOEPromise,
    WETHPromise,
    WBTCPromise,
  ]);

  const BNB_WAVAX_Pair = await getPairPrice("0xeb8eb6300c53c3addbb7382ff6c6fbc4165b0742");
  const BNB = BNB_WAVAX_Pair * WAVAX;

  const LINK_WAVAX_Pair = await getPairPrice("0x6f3a0c89f611ef5dc9d96650324ac633d02265d3");
  const LINK = LINK_WAVAX_Pair * WAVAX;

  // const MIM_WAVAX_Pair = await getPairPrice("0x781655d802670bba3c89aebaaea59d3182fd755d");
  // const MIM = MIM_WAVAX_Pair * WAVAX;


  return {
    WAVAX,
    JOE,
    WETH,
    WBTC,
    BNB,
    LINK,
    
  };
}
