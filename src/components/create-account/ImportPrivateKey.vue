<template>
  <div id="import-private-key">

    <p>秘密鍵を入力してください</p>

    <textarea rows="2" cols="30" maxlength="66" v-model="privateKey"></textarea>

    <button type="button" class="app-button" @click="importPrivateKey">インポート</button>

    <Information :messages="information"/>

    <p v-if="success">インポートに成功しました!</p>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import { SimpleWallet } from 'nem-library';

import Information from '@/components/information.vue';

import Wallet from '@/class/wallet/wallet.ts';
import { CreateAcountPages } from '@/components/create-account/types.ts';
import { InformationMessage } from '@/interface.ts';

@Component({
  components: {
    Information,
  },
})
export default class ImportPrivateKey extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private complete: boolean = false;
  private error: boolean = false;
  private information: InformationMessage[] = [];
  private privateKey: string = '';
  private success: boolean = false;

  private importPrivateKey() {
    this.information = [];

    // 入力されたプライベートキーに間違いがないかチェック
    if (!this.validation()) { return; }

    try {
      // プライベートキーをインポートしてアカウント作成、ローカルストレージにセット
      const account = this.wallet.createWithPrivateKey(this.privateKey);
      this.setLocalStorage(account);
      this.success = true;
      // インポート成功後自動でモーダルを閉じる
      setTimeout(() => {
        this.modalClose();
      }, 3000);
    } catch {
      // validationできてないエラーがあれば表示
      this.information.push({
        name: 'error',
        message: '秘密鍵の形式が違います。入力に間違いがないか確認してください。',
        color: 'red',
      });
    }
  }

   // accountDataを保存
  private setLocalStorage(account: SimpleWallet) {
    // ローカルストレージからデータ取得、なければリターン
    const accountDataStorageName = this.wallet.walletName;
    const accountDataJson = localStorage.getItem(accountDataStorageName);
    if (!accountDataJson) { return; }

    const accountData = JSON.parse(accountDataJson);
    // 作成されたアカウントからアドレスとパブリックキー取得
    const publicData = { address: this.wallet.address, publicKey: this.wallet.publicKey };
    // ローカルストレージから取得したデータのaccountData部分をpublicDataで書き換える
    accountData.accountData = publicData;
    const accData = JSON.stringify(accountData);
    // アカウントのデータをローカルストレージに保存
    localStorage.setItem(accountDataStorageName, accData);

    const key = JSON.stringify(account.encryptedPrivateKey);
    const keyStorageName = `${this.wallet.walletName}-key`;
    // key保存
    localStorage.setItem(keyStorageName, key);
  }

  private modalClose() {
    this.$emit('modalClose');
  }

  private validation(): boolean {
    if (this.privateKey === '') {
      this.information.push({
        name: 'error',
        message: '秘密鍵を入力してください',
        color: 'red',
      });
      return false;
    }

    if (this.privateKey.length < 64) {
      this.information.push({
        name: 'error',
        message: '秘密鍵は64文字以上〜66文字以内です',
        color: 'red',
      });
      return false;
    }

    return true;
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #import-private-key {
    text-align: center;
  }

  textarea {
    display: inline;
    background-color: #fbfcfd;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
  }

  button {
    margin-top: 10px;
  }
}
</style>