<template>
  <div id="app">

    <v-card color="#2182f1">
      <v-layout justify-center>
        <v-card-title style="font-size: 20px;">
          amount
        </v-card-title>
      </v-layout>
    </v-card>

    <router-view/>
    <div id="nav">
      <span class="router-content">
        <router-link to="/transfer"><span class="content-child">送金</span></router-link>
      </span>

      <span class="router-content">
        <router-link to="/history">履歴</router-link>
      </span>

      <span class="router-content">
        <router-link to="/withdraw">出金</router-link>
      </span>

      <span class="router-content">
        <router-link to="/config">設定</router-link>
      </span>
      <!--
      <v-btn color="blue" @click="routerTransfer">送金</v-btn>
      <v-btn color="blue" @click="routerHistory">履歴</v-btn>
      <v-btn color="blue" @click="routerWithdraw">出金</v-btn>
      <v-btn color="blue" @click="routerConfig">設定</v-btn>
      -->

      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  /*
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
  */
}
</script>


<style>
body {
  background-color: #63a9f8;
  text-align: center;
}

@media screen and (max-width: 500px) {
  /*width: 100%;でposition: fixed;中央寄せできる*/
  #nav {
    background-color: #2182f1;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 5px 5px;
    font-size: 20px;
  }

  a {
    text-decoration: none;
    color: black;
    padding: 0.2em 0.5em 0.2em 0.5em;
    box-shadow: 0px 1px 1px;
  }
}
</style>
