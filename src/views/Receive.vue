<template>

  <div id="receive">

    <!--秘密鍵がローカルストレージになかった場合-->
    <modal-window :open="privateKeyModal.open" :modalSize="privateKeyModal.size">

      <p>秘密鍵が見つかりませんでした</p>
      <import-private-key @modalClose="modalClose" />

    </modal-window>

    <qriously v-model="QR.text" :size="QR.size"></qriously>

    <!--walletアドレス-->
    <div class="content">
      アドレス<br>
      {{ wallet.address }}
    </div>

    <private-key-text :keyModalOpen="keyModalOpen"/>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import Filters from '@/filters.vue';
import ImportPrivateKey from '@/components/create-account/ImportPrivateKey.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import PrivateKeyText from '@/components/PrivateKeyText.vue';

import LocalStorage from '../ts/local-storage';
import { ModalSize } from '../types/enum';
import Wallet from '../ts/wallet';

@Component({
  components: {
    ImportPrivateKey,
    ModalWindow,
    PrivateKeyText,
  },
})
export default class Receive extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private displayPrivateKeyButton: boolean = false;
  private displayPrivateKeyButtonText: string = '秘密鍵を見る';
  private privateKey: string = '';

  private privateKeyModal: {open: boolean, size: ModalSize} = {
    open: false,
    size: ModalSize.Small,
  };

  private QR: { text: string, size: number } = {
    text: this.wallet.generateAddressQRText(),
    size: 200,
  };

  // 秘密鍵のインポート画面を表示する。PrivateKeyText.vueから呼び出す。
  private keyModalOpen = () => { this.privateKeyModal.open = true; };

  // 押すとプライベートキーを表示するボタン
  private displayPrivateKeybutton() {
    // ローカルストレージからプライベートキーを取得。なければインポート画面へ
    const key = LocalStorage.getKey(this.wallet.walletName);
    if (!key) {
      this.privateKeyModal.open = true;
      return;
    }

    const privateKey = this.wallet.decrypto(key);
    this.privateKey = privateKey;

    if (this.displayPrivateKeyButton) {
      this.displayPrivateKeyButton = false;
      this.displayPrivateKeyButtonText = '秘密鍵を見る';
      this.privateKey = '';
    } else {
      this.displayPrivateKeyButton = true;
      this.displayPrivateKeyButtonText = '秘密鍵を隠す';
    }
  }

  private modalClose() {
    this.privateKeyModal.open = false;
  }
}
</script>

<style scoped>
#receive {
  text-align: center;
  padding: 3%;
  word-wrap: break-word;
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
}

.hyphen-button {
  background-color: #b5def585;
  color: red;
  border-style: none;
  outline: none;
}

@media screen and (max-width: 500px) {
  .account-privatekey {
    font-size: 3.6vw;
  }

  .content {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .privatekey {
    padding: 5px;
    border: 1px solid red;
  }

  .privatekey-description {
    font-size: 3.8vw;
  }
}
</style>