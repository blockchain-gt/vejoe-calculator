/* eslint-disable no-unused-vars */
const Web3 = require('web3')
const fs = require('fs') //file i/o

//Set up, translated from the python folder
const rpc = "https://api.avax.network/ext/bc/C/rpc"
const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
//Load abis
const bmc_abi = JSON.parse(fs.readFileSync("../abi/BoostedMasterChefJoe_abi1.json"))
const JLP_abi = JSON.parse(fs.readFileSync("../abi/JLP_abi.json"))
const veJOE_abi = JSON.parse(fs.readFileSync("../abi/veJOE_abi.json"))

const LPS = {
    "USDC/USDCe" : {
        "JLP": "0x2A8A315e82F85D1f0658C5D66A452Bbdd9356783",
        "tokenAContractAddr": "",
        "tokenBContractAddr": "",
        "tokenASymbolURL": "",
        "tokenBSymbolURL": "",
    }
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
    //First kernal test, finding JLP pool share
    var wallet = '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F'
    const poolShare = await getPoolShare(wallet, LPS["USDC/USDCe"]["JLP"], JLP_abi)
    console.log(poolShare) //0.5873449796433704

    //Second kernal test, executing same function for veJOE_share
    wallet = "0x500fBF102936bD6D470D6aCA7E54427216bb47BA"
    const veJOE_contract_address = "0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456" //Needed since the LPS isn't provided
    const veJOE_share = await getPoolShare(wallet, veJOE_contract_address, veJOE_abi)
    console.log(veJOE_share) //0.00006759801609830352

    //Now the part that was giving trouble
    const bmc_contract_address = "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00"
    const poolInfo = await getPoolInfo(11, bmc_contract_address, bmc_abi)
    console.log(poolInfo[0])
}
main().then()