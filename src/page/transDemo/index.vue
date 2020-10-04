<template>
  <div class="wrap">
    <Login />
    <connectSocket />
    <getBalance />
    <getOrder />
  </div>
</template>

<script>
import Login from '../../components/login/index'
import getBalance from '../../components/getBalance/index'
import getOrder from '../../components/getOrder/index'
import connectSocket from '../../components/connectSocket/index'

export default {
  name: 'page',

  components: {
    Login,
    getBalance,
    getOrder,
    connectSocket
  },

}
</script>

<style scoped lang="scss">
@import 'index';
</style>
