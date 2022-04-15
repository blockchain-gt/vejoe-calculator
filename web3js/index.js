/* eslint-disable no-unused-vars */
const Web3 = require("web3");

const fs = require("fs"); //file i/o
const { resolve } = require("path");

//Set up, translated from the python folder
const rpc = "https://api.avax.network/ext/bc/C/rpc";
const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

//Load abis and create contract objects

const bmc_abi = JSON.parse(fs.readFileSync(resolve("./abi/bmc_abi.json")));
const bmc_contract_address = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F";
const bmc = new web3.eth.Contract(bmc_abi, bmc_contract_address);

let totalJPS = null;

const JLP_abi = JSON.parse(fs.readFileSync(resolve("./abi/JLP_abi.json")));
const ERC20_abi = JSON.parse(fs.readFileSync(resolve("./abi/ERC20_abi.json")));

async function getLP(pid) {
  if (!totalJPS) {
    totalJPS = await bmc.methods.joePerSec().call();
  }
  let data = await bmc.methods.poolInfo(pid).call();
  let JLP_contract = new web3.eth.Contract(JLP_abi, data.lpToken);
  let token0 = await JLP_contract.methods.token0().call();
  let token0_contract = new web3.eth.Contract(ERC20_abi, token0);
  let token1 = await JLP_contract.methods.token1().call();
  let token1_contract = new web3.eth.Contract(ERC20_abi, token1);
  const lpData = {
    lpToken: data.lpToken,
    token0: token0,
    token0Symbol: await token0_contract.methods.symbol().call(),
    token0Name: await token0_contract.methods.name().call(),
    token0Decimals: await token0_contract.methods.decimals().call(),
    token1: token1,
    token1Symbol: await token1_contract.methods.symbol().call(),
    token1Name: await token1_contract.methods.name().call(),
    token1Decimals: await token1_contract.methods.decimals().call(),
    totalSupply: data.totalLpSupply,
    totalFactor: data.totalFactor,
    reserves: await JLP_contract.methods.getReserves().call(),
    allocPoint: data.allocPoint,
  };

  return lpData;
}

async function getLPs() {
  let num_pools = await bmc.methods.poolLength().call();
  let pid = 0;
  let pool_data = [];
  while (pid < num_pools) {
    pool_data.push(getLP(pid));
    pid++;
  }
  return Promise.all(pool_data);
}

async function main(pid) {
  const lps = await getLPs();
  const json = JSON.stringify(lps, null, 2);
  fs.writeFileSync("./src/lib/data/lps.json", json);
}

main().then();
