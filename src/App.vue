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
}

/*スマホ*/
@media screen and (max-width: 800px) {
  .app-button {
    background-color: #c8c9ca;
    font-size: 16px;
    border: 0.3px solid #d8d9da;
    border-radius: 15px;
    padding: 6px;
  }
}
</style>
