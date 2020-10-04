const Web3 = require('web3');
const fs=require('fs');
const root="/Users/gordon/bian/dapp/dice/";
let data=fs.readFileSync(root+'contractData.json');
let config={};
if(data){
  config= JSON.parse(data);
}
let contractName="MoonDice";
let web3 = new Web3('wss://data-seed-prebsc-1-s1.binance.org:8545');
console.log(web3.eth)
let abi=require(root+"build/contracts/"+contractName+".json").abi;
let ins=new web3.eth.Contract(abi,config[contractName]);
let acc=web3.eth.accounts.privateKeyToAccount("09c1ab7be9b739d182c5fc58d122c5c60101a4979c3049746696dd6cfd1152b8");
web3.eth.accounts.wallet.add(acc);
let txArg=
  {
    from:acc.address,
    gasLimit: 1000000,
    gasPrice: 1000000,
    value: 10000000
  }
async function main(){}
main().then(async ()=>{
  ins.methods.rollDice('0x0000000000000000000000000000000000000000',0,5,0,'burn').send(txArg,(err,rs)=>{
    console.log(err);
    console.log(rs);
  });
});

new web3.eth.getTransaction('0x4ca99961248598874846e4f24dde01f3036ad7864f19663a11a0147c2b164a90', (err, res) => {
  console.log('11111',res)
} )

new web3.eth.getTransaction('0xd58794ce17edd28beb28abc96400e6afd34fce2ad396005c997424a00758e741', (err, res) => {
  console.log('222222',res)
} )



// const tx = {
//   // this could be provider.addresses[0] if it exists
//   from: fromAddress,
//   // target address, this could be a smart contract address
//   to: toAddress,
//   // optional if you want to specify the gas limit
//   gas: gasLimit,
//   // optional if you are invoking say a payable function
//   value: value,
//   // this encodes the ABI of the method and the arguements
//   data: myContract.methods.myMethod(arg, arg2).encodeABI()
// };
//
//
// const signPromise = web3.eth.signTransaction(tx, tx.from);
// const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
//
// signPromise.then((signedTx) => {
//   // raw transaction string may be available in .raw or
//   // .rawTransaction depending on which signTransaction
//   // function was called
//   const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
//   sentTx.on("receipt", receipt => {
//     // do something when receipt comes back
//   });
//   sentTx.on("error", err => {
//     // do something on transaction error
//   });
// }).catch((err) => {
//   // do something when promise fails
// });
