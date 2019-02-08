<template>
  <div id="app">

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


<style>
body {
  background-color: #b9d5f5;
}

#nav {
  background-color: #95c1f3;
  display: flex;
}

a {
  text-decoration: none;
  flex-grow: 1;
  color: black;
}

.xem-amount {
  background-color: #95c1f3;
}

/*PC*/
@media screen and (min-width: 701px) {
  a {
    border-bottom: 1px solid#c9ced4;
    border-left: 0.5px solid#c9ced4;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .xem-amount {
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 20px;
    border-top: 1px solid#c9ced4;
    padding-top: 18px;
    padding-bottom: 18px;
  }
}

/*スマホ*/
@media screen and (max-width: 800px) {
  #nav {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  a {
    border-top: 1px solid#c9ced4;
    border-left: 0.5px solid#c9ced4;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .app-button {
    background-color: #c8c9ca;
    border: 0.3px solid #d8d9da;
    border-radius: 15px;
    padding: 8px;
  }

  .xem-amount {
    text-align: center;
    font-size: 20px;
    border-bottom: 1px solid#c9ced4;
    padding-top: 18px;
    padding-bottom: 18px;
  }
}
</style>
