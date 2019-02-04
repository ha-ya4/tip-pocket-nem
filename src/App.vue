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

@Component
export default class Home extends Vue {
}
</script>


<style>
body {
  background-color: #b9d5f5;
  text-align: center;
}

#nav {
  background-color: #95c1f3;
  display: flex;
  justify-content: center;
  align-items: center;
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
@media screen and (max-width: 700px) {
  #nav {
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

  .xem-amount {
    font-size: 20px;
    border-bottom: 1px solid#c9ced4;
    padding-top: 18px;
    padding-bottom: 18px;
  }
}
</style>
