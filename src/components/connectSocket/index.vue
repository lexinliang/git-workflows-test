<template>
  <div class="getBalance_wrap">
    <el-button  @click="linkWebSocket()" v-if="!isConnectSocket">connect Dice websocket</el-button>
    <el-button  @click="downLinkWebSocket()" v-if="isConnectSocket">disconnect Dice websocket</el-button>
  </div>
</template>

<script>

import {diceSocket} from '../../service/sock'

export default {
  name: 'index',

  data() {
    return {
      isConnectSocket: false,
      loading: null
    }
  },

  mounted() {
    this.linkWebSocket()
    diceSocket.on('connect', (err) => {
      console.log(1123)
      this.loading.close()
      if(err) {
        console.log(err)
      }
      this.isConnectSocket = true

    })

  },

  methods: {

    linkWebSocket() {
      // this.socketApi.initWebSocket()
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      setTimeout(() => {
        this.socketApi.diceSocket.connect()
      },500)

    },
    downLinkWebSocket() {
      this.socketApi.diceSocket.disconnect()
      this.isConnectSocket = false
    }


  },
}
</script>

<style scoped lang="scss">
@import './index';
</style>
