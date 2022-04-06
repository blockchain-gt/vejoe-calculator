/* eslint-disable no-unused-vars */
const Web3 = require('web3')
const Web3Eth = require('web3-eth')
const Web3HttpProvider = require('web3-providers-http');

const fs = require('fs') //file i/o

//Set up, translated from the python folder
const rpc = "https://api.avax.network/ext/bc/C/rpc"
const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
//Load abis
const bmc_abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"allocPoint","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"veJoeShareBp","type":"uint256"},{"indexed":true,"internalType":"contract IERC20","name":"lpToken","type":"address"},{"indexed":true,"internalType":"contract IRewarder","name":"rewarder","type":"address"}],"name":"Add","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Harvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Init","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"allocPoint","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"veJoeShareBp","type":"uint256"},{"indexed":true,"internalType":"contract IRewarder","name":"rewarder","type":"address"},{"indexed":false,"internalType":"bool","name":"overwrite","type":"bool"}],"name":"Set","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastRewardTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpSupply","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accJoePerShare","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accJoePerFactorPerShare","type":"uint256"}],"name":"UpdatePool","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"JOE","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MASTER_CHEF_V2","outputs":[{"internalType":"contract IMasterChefJoe","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MASTER_PID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VEJOE","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"_allocPoint","type":"uint96"},{"internalType":"uint32","name":"_veJoeShareBp","type":"uint32"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"},{"internalType":"contract IRewarder","name":"_rewarder","type":"address"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"claimableJoe","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvestFromMasterChef","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_dummyToken","type":"address"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IMasterChefJoe","name":"_MASTER_CHEF_V2","type":"address"},{"internalType":"contract IERC20","name":"_joe","type":"address"},{"internalType":"contract IERC20","name":"_veJoe","type":"address"},{"internalType":"uint256","name":"_MASTER_PID","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"joePerSec","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingTokens","outputs":[{"internalType":"uint256","name":"pendingJoe","type":"uint256"},{"internalType":"address","name":"bonusTokenAddress","type":"address"},{"internalType":"string","name":"bonusTokenSymbol","type":"string"},{"internalType":"uint256","name":"pendingBonusToken","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint96","name":"allocPoint","type":"uint96"},{"internalType":"uint256","name":"accJoePerShare","type":"uint256"},{"internalType":"uint256","name":"accJoePerFactorPerShare","type":"uint256"},{"internalType":"uint64","name":"lastRewardTimestamp","type":"uint64"},{"internalType":"contract IRewarder","name":"rewarder","type":"address"},{"internalType":"uint32","name":"veJoeShareBp","type":"uint32"},{"internalType":"uint256","name":"totalFactor","type":"uint256"},{"internalType":"uint256","name":"totalLpSupply","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"pools","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint96","name":"_allocPoint","type":"uint96"},{"internalType":"uint32","name":"_veJoeShareBp","type":"uint32"},{"internalType":"contract IRewarder","name":"_rewarder","type":"address"},{"internalType":"bool","name":"_overwrite","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_newVeJoeBalance","type":"uint256"}],"name":"updateFactor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"},{"internalType":"uint256","name":"factor","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const JLP_abi = JSON.parse(fs.readFileSync("../abi/JLP_abi.json"))
const veJOE_abi = JSON.parse(fs.readFileSync("../abi/veJOE_abi.json"))
//contract addresses
const veJOE_contract_address = "0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456"
const bmc_contract_address = "0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F"

const LPS = {
    "USDC/USDCe" : {
        "JLP": "0x2A8A315e82F85D1f0658C5D66A452Bbdd9356783",
        "tokenAContractAddr": "",
        "tokenBContractAddr": "",
        "tokenASymbolURL": "",
        "tokenBSymbolURL": "",
    }
}
async function getWalletBalance(wallet, contractAddress, abi) {
    const contract = new web3.eth.Contract(abi, contractAddress)
    const myBalance = await contract.methods.balanceOf(wallet).call()
    return myBalance
}
/*
    @param myBalance: user's total JOE balance
    @const JOE_PER_SECOND: 0.000003215020576 as listed in 
    https://docs.traderjoexyz.com/main/trader-joe/staking/vejoe-staking#accrual-speed-base-rate
    @const SECONDS_PER_YEAR: 31536000

    myBalance * JOE_PER_SECOND should return veJOE accrued per second, then multiplied out to yearly.
*/
function getBaseAPR(myBalance) {
    return myBalance * 0.000003215020576 * 31536000
}
async function getPoolShare(wallet, contractAddress, abi) {
    const contract = new web3.eth.Contract(abi, contractAddress)
    const myBalance = await contract.methods.balanceOf(wallet).call()
    const totalBalance = await contract.methods.totalSupply().call()
    return myBalance / totalBalance
}

async function getPoolInfo(pool_num, contractAddress, abi) {
    const contract = new web3.eth.Contract(abi, contractAddress) 
    return await contract.methods.poolInfo(pool_num).call()
}

async function main() {
    // //First kernal test, finding JLP pool share
    // var wallet = '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F'
    // const poolShare = await getPoolShare(wallet, LPS["USDC/USDCe"]["JLP"], JLP_abi)
    // console.log(poolShare) //0.5873449796433704

    // //Second kernal test, executing same function for veJOE_share
    // wallet = "0x500fBF102936bD6D470D6aCA7E54427216bb47BA"
    // const veJOE_share = await getPoolShare(wallet, veJOE_contract_address, veJOE_abi)
    // console.log(veJOE_share) //0.00006759801609830352

    // //Third kernal
    // const poolInfo = await getPoolInfo(11, bmc_contract_address, bmc_abi)
    // console.log(poolInfo)

    //Base APR
    const wallet = "0x500fBF102936bD6D470D6aCA7E54427216bb47BA" 
    const myBalance = await getWalletBalance(wallet, veJOE_contract_address, veJOE_abi)
    console.log(myBalance)
    const res = getBaseAPR(myBalance)
    console.log(res)

}
main().then()