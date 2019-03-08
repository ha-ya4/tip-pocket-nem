<template>
  <div id="delete-account">
      <button type="button" class="app-button" @click="modalOpen">
      アカウント削除
      </button>

    <modal-window @modalClose="modalClose" :open="modal.open" :modalSize="modal.size">
      <div v-if="!done">
        本当に削除しますか？
        <button type="button" class="app-button" @click="deleteAccount">
        はい
        </button>
        <button type="button" class="app-button" @click="modalClose">
        いいえ
        </button>
      </div>
      <span v-if="done">アカウントを削除しました</span>
    </modal-window>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import ModalWindow from '@/components/modal-window/ModalWindow.vue';

import { ModalSize } from '@/types/enum';
import Wallet from '@/class/wallet.ts';

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
    size: ModalSize.Small,
  };

  private deleteAccount() {
    const accountDataStorageName = this.wallet.walletName;
    localStorage.removeItem(accountDataStorageName);
    const keyStorageName = `${this.wallet.walletName}-key`;
    localStorage.removeItem(keyStorageName);

    this.done = true;

    setTimeout(() => {
      this.modalClose();
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
</style>