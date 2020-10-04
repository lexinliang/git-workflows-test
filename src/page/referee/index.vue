<template>
  <div>
    <p v-if="code">你已设置过推荐码为:{{ code }}</p>
    <el-button type="text" @click="open">推荐人

      
    </el-button>
  </div>
</template>

<script>
let config = require("./contractName.json");
import { getRefcode, getYoucode } from "./operation";
import Clipboard from 'clipboard'
export default {
  data() {
    return {
      code: "",
    };
  },
  mounted() {
    getYoucode(window.web3.eth.coinbase).then((res) => {
      if (res) {
        this.code = res;
      }
    });
  },
  methods: {
    getCode(value) {
      getRefcode(value).then((res) => {
        console.log(web3.toDecimal(res), "res======结果");

        if (web3.toDecimal(res)) {
          this.$message({
            type: "error",
            message: "此推荐码已被" + res + "注册",
          });
        } else {
          this.setCode(value);
        }
      });
    },
    async setCode(code) {
      let gas = "0x" + Number(1000000).toString(16);
      let gasPrice = "0x" + Number(20000000000).toString(16);
      let value = "0x" + Number(0).toString(16);
      let str =
        "0000000000000000000000000000000000000000000000000000000000000000";
      let num = web3.fromDecimal(code.length).substr(2);
      let dataValueRes = str.substr(0, 64 - num.length) + num;
      let setCode = web3.fromAscii(code, 64).substr(2);
      let data =
        "0x3e0183d1" +
        "0000000000000000000000000000000000000000000000000000000000000020" +
        dataValueRes +
        setCode;

      console.log(data);
      const transactionParameters = {
        nonce: "0x012", // ignored by MetaMask
        gasPrice: gasPrice, // customizable by usser during MetaMask confirmation.
        gas: gas, // customizable by user during MetaMask confirmation.
        to: config.Referralship, // Required except during contract publications. poll
        from: ethereum.selectedAddress, // must match user's active address.
        value: value, // Only required to send ether to the recipient from the initiating external account.
        data: data,
        chainId: 97, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      console.log(transactionParameters, "--------");
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log(txHash, code, "txHash========>>>>>");
      this.getStatus(txHash, code);
    },
    //  判断交易状态
    getStatus(hash, code) {
      web3.eth.getTransactionReceipt(hash, (err, res) => {
        if (err) return console.log(err);
        console.log(res);
        if (res === null) {
          this.getStatus(hash);
          return;
        }
        this.statu = res.status.substr(2);
        if (this.statu == 1) {
          console.log(this.statu, "成功");
          this.$message({
            type: "success",
            message: "设置成功，你的推荐码是: " + code,
          });
        }
        if (this.statu == 0) {
          console.log(this.statu, "失败");
          this.$message({
            type: "error",
            message: "设置失败 ",
          });
        }
      });
    },
    open() {
      this.$prompt("推荐码", "推荐有奖", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9a-zA-Z]{4,16}$/,
        inputErrorMessage: "输入不正确",
      })
        .then(({ action, value }) => {
          console.log(action, value, "action ,value ");
          this.getCode(value);
        })
        .catch(({ action }) => {
          if (action !== "confirm") {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
