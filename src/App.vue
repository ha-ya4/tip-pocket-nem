<template>
  <div id="app">
    <router-view/>
    <div id="nav">
      <router-link to="/transfer">送金</router-link>
      <router-link to="/history">取引履歴</router-link>
      <router-link to="/withdraw">出金</router-link>
      <router-link to="config">設定</router-link>
    </div>
  </div>
</template>

<style scoped>
</style>
