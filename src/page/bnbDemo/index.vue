<template>
  <div class="bnb_wrap">

    <el-button type="success" @click="extractClick()">提取</el-button>
    <input type="text" v-model="num">
    <el-button type="primary" @click="freezeClick()">冻结</el-button>
    <input type="text" v-model="num2">
    <el-button type="info" @click="unFreezeClick()">解冻</el-button>

  </div>
</template>
<script>
let config = require('./contractName.json')
import operation from './operation'

export default {
  name: 'index',

  data() {
    return {
      num: 0,
      num2: 0,
      gameover: null,
      statu: 0,
    }
  },

  methods: {

    //  提取
    extractClick() {
      this.extract()

    },
    // 冻结
    freezeClick() {
      this.freeze()

    },
    // 解冻
    unFreezeClick() {
      this.unFreeze()

    },

    //  tq
    async extract() {
      let gas = '0x' + Number(1000000).toString(16)
      let gasPrice ='0x' + Number(20000000000).toString(16)
      let value = '0x' + Number(0).toString(16)

      let data = '0x683be141'

      console.log(data)
      const transactionParameters = {
        nonce: '0x012', // ignored by MetaMask
        gasPrice: gasPrice, // customizable by usser during MetaMask confirmation.
        gas: gas, // customizable by user during MetaMask confirmation.
        to: config.BLinkPool, // Required except during contract publications. poll
        from: ethereum.selectedAddress, // must match user's active address.
        value: value, // Only required to send ether to the recipient from the initiating external account.
        data: data,
        chainId: 97, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      console.log(transactionParameters ,  '--------')
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log(txHash)
      this.getStatus(txHash)

    },

    //  dj
    async freeze() {
      let gas = '0x' + Number(1000000).toString(16)
      let gasPrice ='0x' + Number(20000000000).toString(16)
      let value = '0x' + Number(0).toString(16)

      let str = '0000000000000000000000000000000000000000000000000000000000000000'  // 64个 0
      let uni = web3.fromDecimal(this.num * 1e6).substr(2)

      let dataValueRes = str.substr(0, (64 - uni.length)) + uni

      let data = '0xcae9ca51' +
        '000000000000000000000000' + config.BLinkStaker.substr(2) +
         dataValueRes +
        '0000000000000000000000000000000000000000000000000000000000000040' +
        '0000000000000000000000000000000000000000000000000000000000000000'


      console.log(data)

      const transactionParameters = {
        nonce: '0x012', // ignored by MetaMask
        gasPrice: gasPrice, // customizable by usser during MetaMask confirmation.
        gas: gas, // customizable by user during MetaMask confirmation.
        to: config.BLinkToken , // Required except during contract publications.  token
        from: ethereum.selectedAddress, // must match user's active address.
        value: value, // Only required to send ether to the recipient from the initiating external account.
        data: data,
        chainId: 97, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      console.log(transactionParameters ,  '--------')

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log(txHash)
      this.getStatus(txHash)


    },

    //  jd
    async unFreeze() {
      let gas = '0x' + Number(1000000).toString(16)
      let gasPrice ='0x' + Number(20000000000).toString(16)
      let value = '0x' + Number(0).toString(16)

      let str = '0000000000000000000000000000000000000000000000000000000000000000'  // 64个 0
      let uni = (this.num2 * 1e6).toString()
      let dataValueRes =  str.substr(0, (64 - uni.length)) + uni

      console.log(dataValueRes)

      let data = '0xe2babfd5' + dataValueRes

      console.log(data)
      const transactionParameters = {
        nonce: '0x012', // ignored by MetaMask
        gasPrice: gasPrice, // customizable by usser during MetaMask confirmation.
        gas: gas, // customizable by user during MetaMask confirmation.
        to: config.BLinkStaker , // Required except during contract publications.  staker
        from: ethereum.selectedAddress, // must match user's active address.
        value: value, // Only required to send ether to the recipient from the initiating external account.
        data: data,
        chainId: 97, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      console.log(transactionParameters ,  '--------')
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      this.getStatus(txHash)

    },

    //  判断交易状态
     getStatus(hash) {
       web3.eth.getTransactionReceipt(hash,(err, res) => {
        if(err) return console.log(err)
         console.log(res)
         if(res === null) {
            this.getStatus(hash)
            return
         }
        this.statu = res.status.substr(2)
         if( this.statu == 1) {
           console.log(this.statu, '成功')
         }
         if( this.statu == 0) {
           console.log(this.statu, '失败')
         }


       })
    }

  },

  mounted() {

  },
}
</script>

<style scoped lang="scss">
.bnb_wrap {
  width: 100%;
  height: 1500px;
  background: antiquewhite;
  padding: 50px;
}
</style>
