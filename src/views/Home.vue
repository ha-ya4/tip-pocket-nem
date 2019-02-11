<template>
  <div id="home">

    <div id="nav">
      <router-link to="/transfer">チップ</router-link>
      <router-link to="/history">履歴</router-link>
      <router-link to="/withdraw">出金</router-link>
      <router-link to="/config">設定</router-link>
    </div>

    <div class="xem-amount">
      amount
    </div>
    <router-view/>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import DataStorage from '@/class/data-storage';

@Component
export default class Home extends Vue {
  // アプリ起動時にローカルストレージからアプリ設定を読み込みvuex.storeを更新する
  private created() {
    const storage = new DataStorage('configData');
    // ローカルストレージから設定を読み込む
    const configData = storage.getData;

    // ローカルストレージに設定のデータがあったか確認。
    if (configData) {
      // あればvuex.storeを更新
      this.$store.commit('Config/UPDATE_CONFIG_DATA', configData);
    } else {
      // なければアプリ設定の初期値をローカルストレージに登録
      const data = this.$store.state.Config;
      storage.setData = data;
    }
  }
}
</script>

<style scoped>
</style>
