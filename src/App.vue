<template>
  <div id="app">
    <div class="app-content">
      <router-view/>
      <div id="nav">
        <v-btn color="blue" @click="routerTransfer">送金</v-btn>
        <v-btn color="blue" @click="routerHistory">取引履歴</v-btn>
        <v-btn color="blue" @click="routerWithdraw">出金</v-btn>
        <v-btn color="blue" @click="routerConfig">設定</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  // 送金画面
  private routerTransfer() {
    this.$router.push('transfer');
  }

  // 送受金の履歴画面
  private routerHistory() {
    this.$router.push('history');
  }

  // 出金画面
  private routerWithdraw() {
    this.$router.push('withdraw');
  }

  // アプリ設定画面
  private routerConfig() {
    this.$router.push('config');
  }
}
</script>


<style>
.app-content {
  text-align: center;
}

#nav {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
