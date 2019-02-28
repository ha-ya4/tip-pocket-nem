<template>
  <div id="create-account">

    <div :class="{ 'select-create-next': pages !== 0 }">
      <input type="radio"
        name="radio-item"
        value="new-account"
        @change="radioChanged"
      >
      <label>新規アカウント作成</label><br>

      <input type="radio"
        name="radio-item"
        value="from-privatekey"
        @change="radioChanged"
      >
      <label>秘密鍵をインポート</label>

      <div class="next-button">
        <button type="button" class="app-button" @click="nextPage">次へ</button>
      </div>
    </div>

    <div :class="{ 'import-privatekey-next': pages !== 1 }"></div>

    <div :class="{ 'new-account-next': pages !== 2 }"></div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import{ CreateAcountPages } from '@/components/create-account/enum-pages'

@Component({})
export default class CreateAccount extends Vue {
  private pages: CreateAcountPages = CreateAcountPages.CreateMethod;

  private radioChanged(event: any) {
    switch (event.target.value) {
      case 'new-account':
        break;
      case 'from-privatekey':
        break;
    }
  }

  private nextPage() {
    this.pages = CreateAcountPages.NewAccount;
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #create-account {
    text-align: center;
  }

  .select-create-next {
    animation-name: select-create-next;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }

  @keyframes select-create-next {
    0% {
      position: relative;
      right: 100px;
      transform:translateX(-0px);
    }

    100% {
      transform:translateX(-1000px);
    }
  }

  .next-button {
    text-align: center;
    margin: 15px;
  }

  .import-privatekey-next {}

  .new-account-next {}
}
</style>