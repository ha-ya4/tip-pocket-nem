<template>
  <div id="create-account">

    <div class="select" :class="{ 'select-create-next': pages !== 0 }">
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
      <label>秘密鍵をインポート</label><br>

      <span class="error" v-if="error">どちらか選択してください</span>

      <div class="next-button">
        <button type="button" class="app-button" @click="nextPage">次へ</button>
      </div>
    </div>

    <div v-if="pages === 1" class="position-height" :class="{ 'new-account': pages === 1 }">
      <new-account @modalClose="modalClose" />
    </div>

    <div v-if="pages === 2" class="position-height" :class="{ 'import-privatekey': pages === 2 }">
      privatekey
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import NewAccount from '@/components/create-account/NewAccount.vue';
import ImportPrivateKey from '@/components/create-account/ImportPrivateKey.vue';

import { CreateAcountPages } from '@/components/create-account/types.ts';
import { InformationMessage } from '@/interface.ts';

@Component({
  components: {
    NewAccount,
    ImportPrivateKey,
  },
})
export default class CreateAccount extends Vue {
  private error: boolean = false;
  private pages: CreateAcountPages = CreateAcountPages.CreateMethod;
  private createMethod: CreateAcountPages;

  private radioChanged(event: any) {
    this.error = false;
    switch (event.target.value) {
      case 'new-account':
        this.createMethod = CreateAcountPages.NewAccount;
        break;
      case 'from-privatekey':
        this.createMethod = CreateAcountPages.ImportPrivateKey;
        break;
    }
  }

  private nextPage() {
    if (this.createMethod === undefined) {
      this.error = true;
      return;
    }
    this.pages = this.createMethod;
    this.error = false;
  }

  private modalClose() {
    this.$emit('modalClose');
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #create-account {
    margin-top: 5%;
  }

  .error {
    color: red;
  }

  .select {
    text-align: center
  }

  /*横スライドでけしたかったが保留*/
  .select-create-next {
    display: none;
    animation-name: select-create-next;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }
  @keyframes select-create-next {}

  .next-button {
    margin: 15px;
  }

  .position-height {
    position: relative;
    bottom: 20%;
  }

  .new-account {
    animation-name: new-account;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }
  @keyframes new-account {
    0% {
      transform:translateX(1000px);
    }

    100% {
      transform:translateX(0px);
    }
  }

  .import-privatekey {
    animation-name: import-privatekey;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }

  @keyframes import-privatekey {
    0% {
      transform:translateX(1000px);
    }

    100% {
      transform:translateX(0px);
    }
  }
}
</style>