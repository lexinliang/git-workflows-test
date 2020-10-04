<template>
  <div class="login_wrap">
    <el-button  @click="login()">{{ test }}</el-button>
    <el-tag type="success" v-if="address"> address：{{ address }}</el-tag>
  </div>
</template>

<script>

export default {
  data() {
    return {
      test: 'login',
      address: '',
    }
  },

  methods: {
    async initMetaMask() {
      let nounce
      if (!window.web3) {//用来判断你是否安装了metamask
        this.$message.error('请安装metamask');        // ;//如果没有会去提示你先去安装
        return;
      }
      if (!web3.eth.coinbase) {//这个是判断你有没有登录，coinbase是你此时选择的账号
        this.$message.error('未登陆或未连接metamask');
        return;
      }

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        console.log(web3.eth.coinbase)
        // Use the browser's ethereum provider
        web3.personal.sign(
          web3.fromUtf8("登陆签名"), web3.eth.coinbase, (err, res) => {
            if(err) return reject(err)
            nounce = res
            console.log(nounce)
            this.test = 'has login'
            this.address = ethereum.selectedAddress
            this.$message.success('登陆验证通过，执行下一步逻辑');
          });
      }
    },
    login() {
      this.initMetaMask()
    }
  }
}
</script>

<style scoped lang="scss">
@import './index';
</style>
