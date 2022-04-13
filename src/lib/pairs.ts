/* only dependency is "graphql-request"
 * run with "node pairs.js"
 */
import { GraphQLClient, gql } from "graphql-request";
const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange",
  {
    headers: {},
  }
);

async function getPairPrice(address: string) {
  const query = gql`
    query {
        pairs(where: {id: "${address}" }) {
        id
        name
        token1Price
        }
    }
    `;
  const response = await client.request(query);
  return response;
}

async function main() {
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

  console.log(WAVAX);
  console.log(JOE);
  console.log(WETH);
  console.log(WBTC);
}
