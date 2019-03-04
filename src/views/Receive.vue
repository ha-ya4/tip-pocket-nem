<template>
  <div id="receive">

    <!--walletアドレス-->
    <div class="content">
      address:
      <span class="account-address">{{ wallet.address }}</span>
    </div>

    <!--押すと秘密鍵を表示するボタン-->
    <div class="openPrivateKey">
      <button
        type="button"
        class="app-button"
        @click="displayPrivateKeybutton"
      >
        {{ displayPrivateKeyButtonText }}
      </button>
    </div>

    <!--秘密鍵と説明-->
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
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import LocalStorage from '@/class/local-storage';
import Wallet from '@/class/wallet/wallet.ts';

@Component({})
export default class ReceiveAndWithdraw extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private displayPrivateKeyButton: boolean = false;
  private displayPrivateKeyButtonText: string = '秘密鍵を見る';
  private privateKey: string = '';

  // 押すとプライベートキーを表示するボタン
  private displayPrivateKeybutton() {
    if (this.displayPrivateKeyButton) {
      this.displayPrivateKeyButton = false;
      this.displayPrivateKeyButtonText = '秘密鍵を見る';
      this.privateKey = '';
    }

    this.displayPrivateKeyButton = true;
    this.displayPrivateKeyButtonText = '秘密鍵を隠す';

    // ローカルストレージからプライベートキーを取得してdecryptoする
    const key = LocalStorage.getKey(this.wallet.walletName);
    if (key) {
      const privateKey = this.wallet.decrypto(key);
      this.privateKey = privateKey;
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #receive {
    padding: 3%;
    word-wrap: break-word;
  }
  .account-address {
    font-size: 3.2vw;
    margin-left: 3%;
  }

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