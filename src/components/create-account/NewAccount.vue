<template>
  <div id="new-account">
    <p class="complete">{{ newAccountText }}</p><br>
    address:<br>{{ wallet.address }}

    <div v-if="createAccountComplete">
      <p class="privatekey-description">
          秘密鍵をメモしてください。秘密鍵を忘れてしまったり、他人に知られてしまうと大事な資産を失うことになります。
          あなたが管理するもので、誰かが変わりに管理してはくれません。必ず紙に書いて厳重に保管してください。
      </p>
      <!--押すと秘密鍵を表示するボタン-->
      <div class="button">
        <button type="button" class="app-button" @click="displayPrivateKeybutton">
          秘密鍵を見る
        </button>
      </div>

      <div class="content" v-if="displayPrivateKey">
        <div class="privatekey">
          {{ privateKey }}
        </div>
      </div>

      <div class="button" v-if="modalCloseButton">
        <button type="button" class="app-button" @click="modalClose">
          閉じる
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';

import LocalStorage from '@/class/local-storage';
import Wallet from '@/class/wallet/wallet.ts';
import { InformationMessage } from '@/interface.ts';

@Component({})
export default class NewAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private newAccountText: string = '新規アカウント作成中...';
  private createAccountComplete: boolean = false;
  private displayPrivateKey: boolean = false;
  private privateKey = '';
  private modalCloseButton: boolean = false;

  private created() {
    const account = this.wallet.createAccount();
    LocalStorage.setNemAccount(this.wallet.walletName, this.wallet.address, this.wallet.publicKey);
    LocalStorage.setEncryptedKey(account.encryptedPrivateKey, this.wallet.walletName);
    this.newAccountText = '新規アカウント作成が完了しました';
    this.createAccountComplete = true;
  }

  // 押すとプライベートキーを表示するボタン
  private displayPrivateKeybutton() {
    this.displayPrivateKey = true;
    // ローカルストレージからプライベートキーを取得してdecryptoする。
    const key = LocalStorage.getKey(this.wallet.walletName);
    if (key) {
      const privateKey = this.wallet.decrypto(key);
      this.privateKey = privateKey;
      // １０秒経過で閉じるボタン表示。いらないか？
      setTimeout(() => {
        this.modalCloseButton = true;
      }, 10000);
    }
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
  }

  .complete {
    text-align: center;
  }

  .content {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .privatekey {
    font-size: 2.5vw;
    color: red;
    padding: 5px;
    border: 1px solid red;
  }

  .privatekey-description {
    color: red;
  }

  .button {
    text-align: center
  }
}
</style>