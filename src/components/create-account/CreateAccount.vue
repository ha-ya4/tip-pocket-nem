<template>
  <div id="create-account">

    <modal-window
      :open="modalOpen"
      :modalSize="modalSize"
    >
      <!--アカウントの作成方法を選択する画面-->
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

      <!--新規アカウントを作成-->
      <div v-if="pages === 1" :class="{ 'new-account': pages === 1 }">
        <new-account @modalClose="modalClose"/>
      </div>

      <!--秘密鍵をインポート-->
      <div v-if="pages === 2" :class="{ 'import-privatekey': pages === 2 }">
        <import-private-key @modalClose="modalClose"/>
      </div>
    </modal-window>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';

import NewAccount from '@/components/create-account/NewAccount.vue';
import ImportPrivateKey from '@/components/create-account/ImportPrivateKey.vue';
import ModalWindow from '@/components/modal-window/ModalWindow.vue';

import { ModalSize } from '@/types/enum';
import { CreateAcountPages } from '@/components/create-account/types.ts';
import Wallet from '@/class/wallet.ts';

@Component({
  components: {
    ImportPrivateKey,
    NewAccount,
    ModalWindow,
  },
})
export default class CreateAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  @Prop() private modalOpen: boolean;

  private modalSize: ModalSize = ModalSize.Middle;
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