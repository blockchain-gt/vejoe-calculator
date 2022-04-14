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
/*  See methodology in JLPcontract.sol
*   @param pool_data: LpOption[] struct defining characteristics of token pool
*   @param amount0: input of textfield mapped to token0
*   @param amount1: input of textfield mapped to token1
*/
export async function getIssuance(pool_data: LpOption["poolData"], bal: number) : Promise<{token0: number; token1: number;}> {
  const contract = new Contract(pool_data.lpContract, LP_abi, provider);
  const reserves = await contract.getReserves();
  
  // (JLPBalance / totalSupply / 2) * reserves[0] / token0dec
  const token0 = ((bal / pool_data.totalSupply) * reserves[0]) / 10 ** Number.parseInt(pool_data.token0Decimals);
  // (JLPBalance / totalSupply / 2) * reserves[1] / token1dec
  const token1 = ((bal / pool_data.totalSupply) * reserves[1]) / 10 ** Number.parseInt(pool_data.token1Decimals);
  return { token0: token0, token1: token1 };
}

export async function revertToJLP(pool_data: LpOption["poolData"], amount0: number, amount1: number) {
  const contract = new Contract(pool_data.lpContract, LP_abi, provider);
  const reserves = await contract.getReserves();
  console.log(amount0);
  console.log(amount1);
  console.log(amount0 * (10 ** Number.parseInt(pool_data.token0Decimals)));
  console.log(amount1 * (10 ** Number.parseInt(pool_data.token1Decimals)));

  // (JLPBalance / totalSupply / 2) * reserves[0] / token0dec
  const liquidity = Math.min(
    (amount0 * (10 ** Number.parseInt(pool_data.token0Decimals))) / reserves[0],
    (amount1 * (10 ** Number.parseInt(pool_data.token1Decimals))) / reserves[1]
  );
  
  const iss = liquidity * pool_data.totalSupply;
  return iss;
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
