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
  background-color: #87cefa8c;
  margin: 0;
  word-wrap: break-word;
}

/*スマホ*/
@media screen and (max-width: 800px) {
  .app-button {
    background-color: #c8c9ca;
    outline: none;
    font-size: 16px;
    border-style: none;
    border-radius: 15px;
    padding: 6px;
  }
}
</style>
