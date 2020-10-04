
const Web3 = require('web3');
let config = require('./contractName.json')

let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');  // rpc地址test

let pollContractName = "BLinkPool";
let stakerContractName = "BLinkStaker";
let tokenContractName = "BLinkToken";


let pollabi = require('../../assets/contracts/' + pollContractName +".json").abi;
let stakerabi = require('../../assets/contracts/' + stakerContractName +".json").abi;
let tokenabi = require('../../assets/contracts/' + tokenContractName +".json").abi;


let poolIns = new web3.eth.Contract(pollabi,config[pollContractName]);
let stakerIns = new web3.eth.Contract(stakerabi,config[stakerContractName]);
let tokenIns = new web3.eth.Contract(tokenabi,config[tokenContractName]);

let addr = ethereum.selectedAddress // 通过浏览器metamask获取地址
console.log(addr, '------')

// 获取待提取金额 poll查询
async function extractBalance() {}
extractBalance().then(async () => {
  poolIns.methods.playerBLinkCache(addr).call((err, res) => {
    if(err) return console.log(err)
    console.log(res, res / 1e6, '获取待提取金额')
  })
})

//  获取已提取金额  token查询
async function hasExtract() {}
hasExtract().then(async () => {
  tokenIns.methods.balanceOf(addr).call((err, res) => {
    if(err) return console.log(err)
    console.log(res, res / 1e6,  '获取已提取金额')
  })
})

//  获取已冻结金额  staker查询
async function hasFreeze() {}
hasFreeze().then(async () => {
  stakerIns.methods.getStakeInfoByAddress(addr).call((err, res) => {
    if(err) return console.log(err)
    console.log(res, res.stakeAmount / 1e6,  '获取已冻结金额')
  })
})

// 提取 poll方法
// async function extract() {}
// extract().then(async () => {
//   poolIns.methods.releaseBLinkSelf().send((err, res) => {
//     if(err) return console.log(err)
//     console.log(res, '提取')
//   })
// })



async function main() {}
export { main }






