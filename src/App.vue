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
  margin: 0;
  word-wrap: break-word;
}

/*スマホ*/
@media screen and (max-width: 800px) {
  hr {
    background-color: #bbb;
    border: none;
    height: 1px;
  }

  .app-button {
    background-color: #7fc2ef;
    outline: none;
    border-style: none;
    border-radius: 2px;
    padding: 7px;
  }

   .app-input-text {
    border-style: none;
    font-size: 18px;
    border-bottom: 0.1px solid #7fc2ef;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
