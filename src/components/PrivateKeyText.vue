<template>

  <div id="private-key-text">

    <!--押すと秘密鍵を表示するボタン-->
    <div class="openPrivateKey">

      <button type="button" class="app-button" @click="displayPrivateKeyButton">
        {{ displayPrivateKeyButtonText }}
      </button>

    </div>

    <!--秘密鍵と説明-->
    <div class="content" v-if="displayPrivateKey">

      <p class="privatekey-description">
        秘密鍵は最も重要なものです。秘密鍵を忘れてしまったり、他人に知られてしまうと大事な資産を失うことになります。
        あなたが管理するもので、誰かが変わりに管理してはくれません。必ず紙に書いて厳重に保管してください。
      </p>

      <div class="privatekey">

        <span class="account-privatekey" v-if="!insHyphen">{{ privateKey }}</span>
        <span class="account-privatekey" v-if="insHyphen">{{ privateKey | fInsertHyphen }}</span>

      </div>

      <button type="button" class="hyphen-button" @click="insertHyphen">{{ hyphenButtonText }}</button>

    </div>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';

import Filters from '@/filters.vue';

import LocalStorage from '@/ts/local-storage';
import Wallet from '@/ts/wallet.ts';

@Component({
  mixins: [Filters],
})
export default class DeleteAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  // なぜかemitできなかったので親のモーダルを閉じる関数を受け取ることにする
  @Prop() private keyModalOpen: () => void;

  private displayPrivateKey: boolean = false;
  private displayPrivateKeyButtonText: string = '秘密鍵を見る';
  private hyphenButtonText: string = 'click!';
  private insHyphen: boolean = false;
  private privateKey: string = '';

  // 画面サイズによってhyphenButtonのテキストを変える
  private created() {
    if (window.innerWidth < 800) {
      this.hyphenButtonText = 'tap!';
    }
  }

  // 押すとプライベートキーを表示するボタン
  private displayPrivateKeyButton() {
    // ローカルストレージからプライベートキーを取得。なければインポート画面へ
    const key = LocalStorage.getKey(this.wallet.walletName);
    if (!key) {
      this.keyModalOpen();
      return;
    }

    this.privateKey = this.wallet.decrypto(key);

    if (this.displayPrivateKey) {
      this.displayPrivateKey = false;
      this.displayPrivateKeyButtonText = '秘密鍵を見る';
      this.privateKey = '';
    } else {
      this.displayPrivateKey = true;
      this.displayPrivateKeyButtonText = '秘密鍵を隠す';
    }
  }

  private insertHyphen() {
    this.insHyphen ? this.insHyphen = false : this.insHyphen = true;
  }
}
</script>

<style scoped>
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
  }

  .hyphen-button {
    background-color: transparent;
    color: rgb(243, 166, 22);
    border-style: none;
    outline: none;
  }
</style>