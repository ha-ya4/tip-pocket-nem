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
  word-wrap: break-word;
}

.app-button {
  background-color: #7fc2ef;
  font-size: 1.03em;
  outline: none;
  border-style: none;
  border-radius: 2px;
  padding: 10px;
}

.app-input-text {
  border-style: none;
  font-size: 18px;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
}

.line {
  background-color: #bbb;
  border: none;
  height: 1px;
}

.underline {
  background-color: #7fc2ef;
  border: none;
  height: 1px;
  margin-top: -0.1px;
}

@media screen and (min-width: 501px) {
  body {
    font-size: 1.05vw;
    width: 70%;
    margin-left: 15%;
    margin-right: 15%;
  }
}

@media screen and (max-width: 500px) {
  body {
    font-size: 4.8vw;
    margin: 0;
  }
}
</style>
