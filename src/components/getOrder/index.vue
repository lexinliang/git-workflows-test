<template>
  <div class="getBalance_wrap">
    <el-button  @click="getBalance()">resolveOrder</el-button>
  </div>
</template>

<script>

import {diceSocket} from '../../service/sock'

export default {
  name: 'index',

  data() {
    return {
      isConnectSocket: false,
    }
  },

  mounted() {
    this.socketApi.diceSocket.on('connect', () => {
       this.isConnectSocket = true
    })
    this.socketApi.diceSocket.on('disconnect', () => {
      this.isConnectSocket = false
    })
    this.socketApi.diceSocket.on('resolveOrderResult',
      this.resolveOrderResult
    )
  },

  methods: {
    resolveOrderResult(err) {
      if(err.errorCode === 0) {
        console.log('success')
      } else {
        console.log('failed')
      }
    },

    async useMetaMask() {
      if(!this.isConnectSocket) return this.$message.error('未连接websocket')
      const message = 'bsc-bling'
      let signature = null

      await web3.personal.sign(web3.fromUtf8(message), web3.eth.coinbase,(err, res) => {
        console.log(web3.eth.coinbase, ethereum.selectedAddress)
        signature = res
        let data = {
          signature: signature,
          addr: web3.eth.coinbase
        }
        this.socketApi.diceSocket.emit('resolveOrder', data)


      })
    },

    getBalance() {
      this.useMetaMask()
    },



  },
}
</script>

<style scoped lang="scss">
@import './index';
</style>
