<template>

  <div id="import-private-key">

    <p>秘密鍵を入力してください</p>

    <input type="text" maxlength="66" class="app-input-text" v-model="privateKey">

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
import { Result } from '@/types/enum';
import LocalStorage from '@/ts/local-storage';
import Wallet from '@/ts/wallet.ts';
import { CreateAcountPages } from '@/components/create-account/types.ts';


@Component({
  components: {
    Information,
  },
})
export default class ImportPrivateKey extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

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
      // vuexから設定の初期値をローカルストレージにセットする
      LocalStorage.setAccountData(this.wallet.walletName, this.$store.state.Config);
      LocalStorage.setNemAccount(this.wallet.walletName, this.wallet.address, this.wallet.publicKey);
      LocalStorage.setEncryptedKey(account.encryptedPrivateKey, this.wallet.walletName);
      this.success = true;
      // インポート成功後自動でモーダルを閉じる
      setTimeout(() => {
        this.modalClose();
        this.success = false;
      }, 2000);
    } catch {
      // validationできてないエラーがあれば表示
      const info = new InformationData('red', Result.Error, '秘密鍵の形式が違います。入力に間違いがないか確認してください。');
      this.information.push(info);
    }

    this.privateKey = '';
  }

  private modalClose() {
    this.$emit('modalClose');
  }

  private validation(): boolean {
    if (this.privateKey === '') {
      const info = new InformationData('red', Result.Error, '秘密鍵を入力してください');
      this.information.push(info);
      return false;
    }

    if (this.privateKey.length < 64) {
      const info = new InformationData('red', Result.Error, '秘密鍵は64文字以上〜66文字以内です');
      this.information.push(info);
      return false;
    }

    return true;
  }
}
</script>

<style scoped>
input[type="text"] {
  width: 80%;
}

button {
  margin-top: 2em;
}

#import-private-key {
  text-align: center;
}

@media screen and (min-width: 501px) {
  input[type="text"] {
    width: 90%;
  }

  #import-private-key {
    margin-top: -1em;
  }
}
</style>