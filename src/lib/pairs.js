/* only dependency is "graphql-request"
* run with "node pairs.js"
*/
const { GraphQLClient, gql } = require("graphql-request");
const client = new GraphQLClient("https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange", {
  headers: {},
});

async function getPairPrice(address) {
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
};

async function main() {
    const WAVAX = await getPairPrice("0xf4003f4efbe8691b60249e6afbd307abe7758adb");
    const JOE = await getPairPrice("0x3bc40d4307cd946157447cd55d70ee7495ba6140")
    const WETH = await getPairPrice("0x9a166ae3d4c3c2a7febfae86d16896933f4e10a9")
    const WBTC = await getPairPrice("0x66ab843d86ad296ed1953c179d9ce2bb587ff2aa")

    console.log(WAVAX);
    console.log(JOE);
    console.log(WETH);
    console.log(WBTC);
}
main().then();