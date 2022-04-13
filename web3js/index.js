/* eslint-disable no-unused-vars */
const Web3 = require('web3')

const fs = require('fs') //file i/o

//Set up, translated from the python folder
const rpc = "https://api.avax.network/ext/bc/C/rpc"
const web3 = new Web3(new Web3.providers.HttpProvider(rpc))

//Load abis and create contract objects
const bmc_abi = JSON.parse(fs.readFileSync("../abi/bmc_abi.json"))
const bmc_contract_address = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F"
const bmc = new web3.eth.Contract(bmc_abi, bmc_contract_address)
const SECONDS_IN_YEAR = 60*60*24*365
let totalJPS = null

const veJOE_abi = JSON.parse(fs.readFileSync("../abi/veJOE_abi.json"))
const veJOE_contract_address = "0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456"
const veJOE_contract = new web3.eth.Contract(veJOE_abi, veJOE_contract_address)

const JLP_abi = JSON.parse(fs.readFileSync("../abi/JLP_abi.json"))
const ERC20_abi = JSON.parse(fs.readFileSync("../abi/ERC20_abi.json"))

async function getLP(pid) {
    if (! totalJPS) {
        totalJPS = await bmc.methods.joePerSec().call()
    }
    let data = await bmc.methods.poolInfo(pid).call()
    let JLP_contract = new web3.eth.Contract(JLP_abi, data.lpToken)
    let token0 = await JLP_contract.methods.token0().call()
    let token0_contract = new web3.eth.Contract(ERC20_abi, token0)
    let token1 = await JLP_contract.methods.token1().call()
    let token1_contract = new web3.eth.Contract(ERC20_abi, token1)
    return  {
            lpToken : data.lpToken,
            lpContract : JLP_contract,
            token0 : token0,
            token0Contract : token0_contract,
            token0Symbol : await token0_contract.methods.symbol().call(), 
            token0Name : await token0_contract.methods.name().call(),
            token0Decimals : await token0_contract.methods.decimals().call(),
            token1 : token1,
            token1Contract : token1_contract,
            token1Symbol : await token1_contract.methods.symbol().call(),
            token1Name : await token1_contract.methods.name().call(),
            token1Decimals : await token1_contract.methods.decimals().call(),
            totalSupply : data.totalLpSupply,
            totalFactor : data.totalFactor,
            reserves : await JLP_contract.methods.getReserves().call()
        }
}

async function getLPs() {
    let num_pools = await bmc.methods.poolLength().call()
    let pid = 0
    let pool_data = []
    while (pid < num_pools) {
        pool_data.push(getLP(pid))
        pid++ 
    }
    return Promise.all(pool_data)
}

async function getWalletBalance(wallet, contract) {
    let myBalance = await contract.methods.balanceOf(wallet).call()
    return myBalance
}

async function test() {
    for (let i of [0,1,2,3,4,5,6,7,8,9,10,11]) {
        await main(i)
    }
    // await main(7)
}

async function main(pid) {
    let wallet = "0x1E61E337B218b103D599a6C7495E959dB0A5d287"

    let pool_data = await getLP(pid)

    let veJOE_balance = await getWalletBalance(wallet, veJOE_contract)
    let veJOE_total_supply = await veJOE_contract.methods.totalSupply().call()
    console.log(`veJOE Balance: ${veJOE_balance}`)
    console.log(`veJOE Supply:  ${veJOE_total_supply}`)
    console.log(`veJOE Share:   ${veJOE_balance / veJOE_total_supply * 100}`)

    let price = (pool_data.reserves[0]/10**pool_data.token0Decimals)/(pool_data.reserves[1]/10**pool_data.token1Decimals)
    console.log(`${pool_data.token0Symbol}/${pool_data.token1Symbol}:    ${1/price}`)

    let user_info = await bmc.methods.userInfo(pid, wallet).call()
    let user_liquidity = user_info.amount
    let pool_total_liquidity = pool_data.totalSupply

    console.log(`JLP balance:   ${user_liquidity}`)
    console.log(`JLP share:     ${user_liquidity/pool_total_liquidity}`)

    let veJOEShare = 0.4
    let pool_total_factor = pool_data.totalFactor
    let base_rewards = (user_liquidity*totalJPS*(1-veJOEShare)) / pool_total_liquidity
    let boosted_rewards = (((user_liquidity*veJOE_balance)**0.5)*totalJPS*veJOEShare)/pool_total_factor
    
    console.log(`Yearly rewards: ${((base_rewards+boosted_rewards)/10**18)*(SECONDS_IN_YEAR)}`)
}

test().then()