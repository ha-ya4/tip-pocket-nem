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

import { InformationData } from '@/types/data-class.ts';
import LocalStorage from '@/class/local-storage';
import Wallet from '@/class/wallet.ts';
import { CreateAcountPages } from '@/components/create-account/types.ts';


@Component({
  components: {
    Information,
  },
})
export default class ImportPrivateKey extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private complete: boolean = false;
  private error: boolean = false;
  private information: InformationData[] = [];
  private privateKey: string = '';
  private success: boolean = false;

  private importPrivateKey() {
    this.information = [];

    // 入力されたプライベートキーに間違いがないかチェック
    if (!this.validation()) { return; }

    try {
      // プライベートキーをインポートしてアカウント作成、ローカルストレージにセット
      const account = this.wallet.createWithPrivateKey(this.privateKey);
      LocalStorage.setNemAccount(this.wallet.walletName, this.wallet.address, this.wallet.publicKey);
      LocalStorage.setEncryptedKey(account.encryptedPrivateKey, this.wallet.walletName);
      this.success = true;
      // インポート成功後自動でモーダルを閉じる
      setTimeout(() => {
        this.modalClose();
      }, 2000);
    } catch {
      // validationできてないエラーがあれば表示
      const info = new InformationData('red', 'error', '秘密鍵の形式が違います。入力に間違いがないか確認してください。');
      this.information.push(info);
    }
  }

  private modalClose() {
    this.$emit('modalClose');
  }

  private validation(): boolean {
    if (this.privateKey === '') {
      const info = new InformationData('red', 'error', '秘密鍵を入力してください');
      this.information.push(info);
      return false;
    }

    if (this.privateKey.length < 64) {
      const info = new InformationData('red', 'error', '秘密鍵は64文字以上〜66文字以内です');
      this.information.push(info);
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