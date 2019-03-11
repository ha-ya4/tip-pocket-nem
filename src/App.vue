<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Home from '@/views/Home.vue';

@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {}
</script>


<style>
body {
  background-color: rgba(221, 241, 247, 0.137);
  margin: 0;
  word-wrap: break-word;
}

/*スマホ*/
@media screen and (max-width: 800px) {
  .app-button {
    background-color: rgba(162, 230, 247, 0.5);
    outline: none;
    font-size: 14px;
    border-style: none;
    border-radius: 2px;
    box-shadow: 0 0.5px 1px 0.5px rgba(6, 7, 7, 0.4);
    padding: 3px;
  }
}
</style>
