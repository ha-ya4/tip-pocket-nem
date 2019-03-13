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
  background-color: rgba(247, 248, 248, 0.137);
  margin: 0;
  word-wrap: break-word;
}

/*スマホ*/
@media screen and (max-width: 800px) {
  .app-button {
    background-color: #7fc2ef;
    outline: none;
    border-style: none;
    border-radius: 2px;
    box-shadow: 0 0.5px 1px 0.5px rgba(6, 7, 7, 0.4);
    padding: 5px;
  }

   .app-input-text {
    background-color: #eaf0f7;
    font-size: 18px;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
  }
}
</style>
