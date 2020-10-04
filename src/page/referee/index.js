//  实例化合约查询 底池本金
const Web3 = require('web3');
const fs = require('fs');
let data = fs.readFileSync('./contractName.json');
let config = {};
if(data){
  config= JSON.parse(data);
}
let contractName = "BLinkPool";
let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');  // rpc地址test
let abi = require('../../assets/contracts/' + contractName +".json").abi;
let ins = new web3.eth.Contract(abi,config[contractName]);
let txArg = '0x0000000000000000000000000000000000000000'
async function main() {}

main().then(async () => {
  ins.methods.tokenOriginalAmountMap(txArg).call((err, res) => {
    if(err) return console.log(err)
    console.log(res, 'initial balance')
    console.log(web3.utils.fromWei(res, 'ether'), '+++++++')
  })
});

// web3查询 现存余额
const addr = '0x9cB686Bf213eD8d3a359D16c2a4f04CFB67e9bee' // 私链合约地址test poll
new web3.eth.getBalance(addr,(err, res) => {
  if(err) return console.log(err)
  console.log(res, 'now balance')
  console.log(web3.utils.fromWei(res, 'ether'), '-------')
})





