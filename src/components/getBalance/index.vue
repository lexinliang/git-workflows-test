<template>
  <div class="getBalance_wrap">
    <el-button  @click="getBalance()">getbalance</el-button>
    <el-tag type="success" v-if="balance">{{balance}}</el-tag>

    <div class="roll_wrap">

      <div class="tag_wrap">
        <el-slider v-model="value"  :min='1' :max='99' show-input></el-slider>
      </div>
      <el-radio-group v-model="radio">
        <el-radio :label="0">under</el-radio>
        <el-radio :label="1">above</el-radio>
      </el-radio-group>
      <div class="inpit_wrap">
        <el-input v-model="number" placeholder="请输入eth数量" type="number"></el-input>
      </div>
      <el-button  @click="trans()">roll</el-button>
    </div>

    <div class="getOrder">
      <el-button  @click="ethCall()" disabled>getOrder</el-button>
    </div>
  </div>
</template>

<script>

import {diceSocket} from '../../service/sock'

export default {
  name: 'index',

  data() {
    return {
      isConnectSocket: false,
      balance: '',
      number: '',
      value: 1,
      signData: {},
      oldOrderId: '',
      radio: 0

    }
  },

  mounted() {
    this.sign()
    this.socketApi.diceSocket.on('connect', () => {
      this.isConnectSocket = true
    })
    this.socketApi.diceSocket.on('disconnect', () => {
      this.isConnectSocket = false
    })
    this.socketApi.diceSocket.on('resolveOrderResult', (err) => {
        if(err.errorCode === 0 && err.data.roll !== '255') {
          this.getBalance()
          this.$message('已结束上次订单，可以下注')
          // success
        }
    })
    // this.socketApi.diceSocket.on('getOrderResult', (err , data) => {
    //     if(err.errorCode === 0 && err.data.roll === '255') {
    //       this.resolvetOrderRes()
    //     }
    //     if(err.errorCode === 0 && err.data.roll !== '255') {
    //       this.$message('可以玩')
    //     }
    // })
  },

  methods: {
    async useMetaMask() {
      // let num =  web3.toWei(parseInt(''+ this.number,16), 'ether')
      let num =  web3.toWei(this.number, 'ether')
      // console.log(Number(num), num, Number(num).toString(16))
      let gas = '0x' + Number(1000000).toString(16)
      let gasPrice ='0x' + Number(20000000000).toString(16)
      // let value = '0x' + Number(10000000).toString(16)
      let value = '0x' + Number(num).toString(16)
      // console.log(ethereum.selectedAddress, value, '------')
      // let dataValue = this.value > 10? (''+ this.value) : ('0'+ this.value )
      console.log(this.value)

      // 处理滑块数字转 16进制 拼64字节
      let dataValue  = web3.fromDecimal(this.value).substr(2)
      let str = '0000000000000000000000000000000000000000000000000000000000000000'  // 64个 0
      // let dataValueRes = '0x' + str.substr(0, (64 - dataValue.length)) + dataValue
      let dataValueRes =  str.substr(0, (64 - dataValue.length)) + dataValue
      console.log(dataValueRes)

      let data = '0xff98cdd0' +
        '0000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000' +
         dataValueRes +
        '000000000000000000000000000000000000000000000000000000000000000'  + this.radio +
        '00000000000000000000000000000000000000000000000000000000000000a0' +
        '0000000000000000000000000000000000000000000000000000000000000000' // Optional, but used for defining smart contract creation and interaction.

      console.log(data)
      const transactionParameters = {
        nonce: '0x012', // ignored by MetaMask
        gasPrice: gasPrice, // customizable by usser during MetaMask confirmation.
        gas: gas, // customizable by user during MetaMask confirmation.
        to: '0x3F24D72a8EB24F6E3ad9994c45050b452a793898', // Required except during contract publications.
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
      setTimeout(() => {
        // this.getOrderRes()
        this.ethCall()
      },2000)
    },

    trans() {
      if(!this.isConnectSocket) return this.$message.error('未连接websocket')
      if(!this.balance) return this.$message('请获取余额')
      if(!this.number) return this.$message('请输入金额')
      this.useMetaMask()
    },

    //  获取余额
    async getBalance() {
      let addr = ethereum.selectedAddress
      let params = [addr, 'latest']
      console.log(params)
      const res = await ethereum.request({
        method: 'eth_getBalance',
        params: params
      })
      let num =  web3.fromWei(parseInt(res,16), 'ether')
      this.balance = num
      console.log(res, num)
    },


    resolvetOrderRes() {
      this.socketApi.diceSocket.emit('resolveOrder', this.signData)
    },

    // bsc-bling 签名
    async sign() {
      const message = 'bsc-bling'
      let signature = null
      const addr =  web3.eth.coinbase
      if(addr) {
        await web3.personal.sign(web3.fromUtf8(message), addr,(err, res) => {
          signature = res
          let data = {
            signature: signature,
            addr: web3.eth.coinbase
          }
          this.signData = data
          this.onceInit()
        })
      }
    },

    // 链上 查询订单状态
    async ethCall() {
      let params = {
        from: ethereum.selectedAddress,
        to: '0x3F24D72a8EB24F6E3ad9994c45050b452a793898',
        data: '0x6eba2b13' +
          '000000000000000000000000'+ ethereum.selectedAddress.substr(2, 40)
      }
      const res = await ethereum.request({
        method: 'eth_call',
        params: [params],
      });
      console.log(res)
      let obj = {
        address_bettor: res.substr(0, 66) ,
        tokenAmount:  '0x' + res.substr(66, 64) ,
        orderId: '0x' + res.substr(130, 64) ,
        direction: '0x' + res.substr(194, 64) ,
        number: '0x' + res.substr(258, 64) ,
        roll: '0x' + res.substr(322, 64) ,
        addrToken: '0x' + res.substr(386, 64) ,
      }
      let toDecimalObj = {
        address_bettor: '0x' + obj.address_bettor.substr(-40, 40),
        tokenAmount:  web3.toDecimal(obj.tokenAmount),
        orderId: web3.toDecimal(obj.orderId),
        direction: web3.toDecimal(obj.direction),
        number: web3.toDecimal(obj.number),
        roll: web3.toDecimal(obj.roll),
        addrToken: web3.toDecimal(obj.addrToken)
      }
      let newOrderId = toDecimalObj.orderId

      console.log(toDecimalObj, '------')
      // 新旧orderId相等 && roll !== 255 此时交易链上查询未生效  2s后重新查询
      if(this.oldOrderId == newOrderId) {
        return setTimeout(() => {
          this.ethCall()
        },2000)
      }
      //  新旧orderId不相等 && roll == 255 此时交易链上查询 loading状态   调用websocket resolveOrder 后端结束订单
      if(this.oldOrderId != newOrderId && toDecimalObj.roll == 255) {
        this.resolvetOrderRes()
      }

      //  新旧orderId不相等 && roll !== 255 此时交易链上查询 over 状态  可以下一局游戏
      if(this.oldOrderId != newOrderId  && toDecimalObj.roll != 255) {
        this.$message('游戏完成，可以下注')
      }
      this.oldOrderId = newOrderId
      console.log(obj, toDecimalObj)
    },

    /*
     *  @des 第一次进入页面查询
     *       roll != 255 证明交易结束 可以下注
     *       roll == 255 证明交易在loading  调用websocket resolveOrder 后端结束订单
     *
     */
    async onceInit() {
      let params = {
        from: ethereum.selectedAddress,
        to: '0x3F24D72a8EB24F6E3ad9994c45050b452a793898',
        data: '0x6eba2b13' +
          '000000000000000000000000'+ ethereum.selectedAddress.substr(2, 40)
      }
      const res = await ethereum.request({
        method: 'eth_call',
        params: [params],
      });
      console.log(res)
      let obj = {
        address_bettor: res.substr(0, 66) ,
        tokenAmount:  '0x' + res.substr(66, 64) ,
        orderId: '0x' + res.substr(130, 64) ,
        direction: '0x' + res.substr(194, 64) ,
        number: '0x' + res.substr(258, 64) ,
        roll: '0x' + res.substr(322, 64) ,
        addrToken: '0x' + res.substr(386, 64) ,
      }
      let toDecimalObj = {
        address_bettor: '0x' + obj.address_bettor.substr(-40, 40),
        tokenAmount:  web3.toDecimal(obj.tokenAmount),
        orderId: web3.toDecimal(obj.orderId),
        direction: web3.toDecimal(obj.direction),
        number: web3.toDecimal(obj.number),
        roll: web3.toDecimal(obj.roll),
        addrToken: web3.toDecimal(obj.addrToken)
      }
      // orderId存储 下一次下注查询需要比较
      this.oldOrderId = toDecimalObj.orderId
      console.log(obj, toDecimalObj)
      if(toDecimalObj.roll == '255' && toDecimalObj.orderId != 0) {
        this.resolvetOrderRes()
      }
      if(toDecimalObj.roll == '255' && toDecimalObj.orderId == 0) {
        this.$message('欢迎第一次下注')
      }
      if(toDecimalObj.roll != '255') {
        this.$message('可以下注')
      }
    },



  },
}
</script>

<style scoped lang="scss">
@import './index';
</style>
