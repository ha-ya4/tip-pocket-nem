<template>
  <div id="delete-account">

    <button type="button" class="delete-account-button" @click="modalOpen">アカウント削除</button>

    <modal-window @modalClose="modalClose" :open="modal.open" :modalSize="modal.size">
      <div class="contents" v-if="!done">
        本当に削除しますか？

        <div class="select-button">
          <button type="button" class="app-button" @click="deleteAccount">
          はい
          </button>
          <button type="button" class="app-button" @click="modalClose">
          いいえ
          </button>
        </div>
      </div>

      <div class="delete-message" v-if="done">アカウントを削除しました</div>
    </modal-window>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import ModalWindow from '@/components/modal-window/ModalWindow.vue';

import { ModalSize } from '@/types/enum';
import Wallet from '@/ts/wallet.ts';

@Component({
  components: {
    ModalWindow,
  },
})
export default class DeleteAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private done: boolean = false;

  private modal: {open: boolean, size: ModalSize} = {
    open: false,
    size: ModalSize.Minimum,
  };

  private deleteAccount() {
    const accountDataStorageName = this.wallet.walletName;
    localStorage.removeItem(accountDataStorageName);
    const keyStorageName = `${this.wallet.walletName}-key`;
    localStorage.removeItem(keyStorageName);

    this.done = true;

    setTimeout(() => {
      this.modalClose();
      this.done = false;
    }, 2000);
  }

  private modalClose() {
    this.modal.open = false;
  }

  private modalOpen() {
    this.modal.open = true;
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  .contents {
    text-align: center;
    margin-top: 7%;
  }

  .delete-account-button {
    background-color: transparent;
    border-style: none;
    outline: none;
  }

  .delete-message {
    text-align: center;
    margin-top: 15%;
  }

  .select-button {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
  }
}
</style>