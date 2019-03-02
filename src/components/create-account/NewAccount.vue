<template>
  <div id="new-account">
    {{ newAccountText }}
    {{ wallet.address }}

    <div v-if="createAccountComplete">
      <!--押すと秘密鍵を表示するボタン-->
      <div class="openPrivateKey">
        <button
          type="button"
          class="app-button"
          @click="displayPrivateKeybutton"
        >
          秘密鍵を見る
        </button>
      </div>

      <div class="content" v-if="displayPrivateKeyButton">
        <p class="privatekey-description">
          秘密鍵は最も重要なものです。秘密鍵を忘れてしまったり、他人に知られてしまうと大事な資産を失うことになります。
          あなたが管理するもので、誰かが変わりに管理してはくれません。必ず紙に書いて厳重に保管してください。
        </p>
        <div class="privatekey">
          <span class="account-privatekey">{{ privateKey }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import { SimpleWallet } from 'nem-library';

import Wallet from '@/class/wallet/wallet.ts';
import { AccountData } from '@/components/create-account/types.ts';
import { InformationMessage } from '@/interface.ts';

@Component({})
export default class NewAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private newAccountText: string = '新規アカウント作成中...';
  private createAccountComplete: boolean = false;
  private displayPrivateKeyButton: boolean = false;
  private privateKey = '';

  private created() {
    const account = this.wallet.createAccount();
    this.setLocalStorage(account);
    this.newAccountText = '新規アカウント作成が完了しました';
    this.createAccountComplete = true;
  }

  private displayPrivateKeybutton() {
    this.displayPrivateKeyButton = true;
    const privateKey = this.wallet.decrypto();
    this.privateKey = privateKey;
  }

  // accountDataとkeyを別々に保存
  private setLocalStorage(account: SimpleWallet) {
    // vuexstoreから初期値取得
    const configData = this.$store.state.Config;
    // 作成されたアカウントからアドレスとパブリックキー取得
    const publicData = { address: this.wallet.address, publicKey: this.wallet.publicKey };
    // AccountDataクラス作成
    const accountdata = JSON.stringify(new AccountData(configData, publicData));
    const accountDataStorageName = this.wallet.walletName;
    // アカウントのパブリックデータとアプリ設定をローカルストレージに保存
    localStorage.setItem(accountDataStorageName, accountdata);

    const key = JSON.stringify(account.encryptedPrivateKey);
    const keyStorageName = `${this.wallet.walletName}-key`;
    // key保存
    localStorage.setItem(keyStorageName, key);
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  .account-privatekey {
    font-size: 3.2vw;
  }

  .content {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .privatekey {
    color: red;
    padding: 5px;
    border: 1px solid red;
  }

  .privatekey-description {
    color: red;
    font-size: 3.8vw;
  }

  .openPrivateKey {
    text-align: center
  }
}
</style>