
const Web3 = require('web3');
let config = require('./contractName.json')

let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');  // rpc地址test

let ReferralshipContractName = "Referralship";


let ReferralshipContractNameabi = require('../../assets/contracts/' + ReferralshipContractName + ".json").abi;


let ins = new web3.eth.Contract(ReferralshipContractNameabi, config[ReferralshipContractName]);

let addr = ethereum.selectedAddress // 通过浏览器metamask获取地址
console.log(addr, 'metamask获取地址------')

// 查询这个推荐码有没有被用过
async function getRefcode(code) {
  let result = 0
  await ins.methods.getAddrByReferralCode(code).call((err, res) => {
if (err) return
    console.log(res,code, 'getRefcode=====>>>>')
    result = res
  })

  return result
}



// 查询当前账户是否有推荐码
async function getYoucode(adress) {
  let result = 0
  await ins.methods.getReferralCodeByAddr(adress).call((err, res) => {
if (err) return
    console.log(res,adress, 'getReferralCodeByAddr=====>>>>')
    result = res
  })

  return result
}

export {
  getRefcode,
  getYoucode
}








