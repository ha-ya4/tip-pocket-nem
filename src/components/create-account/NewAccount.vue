<template>
  <div id="new-account">
    <p class="complete">{{ newAccountText }}</p><br>
    アドレス<br>{{ wallet.address }}

    <p><private-key-text/></p>

    <div class="button" v-if="modalCloseButton">
      <button type="button" class="app-button" @click="modalClose">
        閉じる
      </button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';

import PrivateKeyText from '@/components/PrivateKeyText.vue';

import LocalStorage from '@/class/local-storage';
import Wallet from '@/class/wallet.ts';

@Component({
  components: {
    PrivateKeyText,
  },
})
export default class NewAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private newAccountText: string = '新規アカウント作成中...';
  private modalCloseButton: boolean = false;

  private created() {
    const account = this.wallet.createAccount();
    // vuexから設定の初期値をローカルストレージにセットする
    LocalStorage.setAccountData(this.wallet.walletName, this.$store.state.Config);
    LocalStorage.setNemAccount(this.wallet.walletName, this.wallet.address, this.wallet.publicKey);
    LocalStorage.setEncryptedKey(account.encryptedPrivateKey, this.wallet.walletName);
    this.newAccountText = '新規アカウント作成が完了しました';

    // １０秒経過で閉じるボタン表示。いらないか？
    setTimeout(() => {
      this.modalCloseButton = true;
    }, 5000);
  }

  private modalClose() {
    this.$emit('modalClose');
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #new-account {
    font-size: 3vw;
    text-align: center;
  }
}
</style>