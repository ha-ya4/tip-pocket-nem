<template>
  <div id="home">

    <modal-window
      :open="createAccountModal"
    >
    <create-account/>
    </modal-window>

    <div id="nav">
      <router-link to="/transfer">チップ</router-link>
      <router-link to="/history">履歴</router-link>
      <router-link to="/receive">入金</router-link>
      <router-link to="/config">設定</router-link>
    </div>

    <div class="xem-amount">
      {{ balance }}
    </div>

    <router-view/>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import CreateAccount from '@/components/create-account/CreateAccount.vue';
import ModalWindow from '@/components/modal-window/ModalWindow.vue';

import DataStorage from '@/class/data-storage';
import Wallet from '@/class/wallet/wallet.ts';

@Component({
  components: {
    CreateAccount,
    ModalWindow,
  },
})
export default class Home extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private balance: number = 0;
  private walletName: string = 'tip-pocket';
  private walletPassword: string = 'tip-pocket-nem-wallet';
  private createAccountModal: boolean = false;

  // ローカルストレージからアプリ設定を読み込みvuex.storeを更新する
  // walletの残高を取得する
  private created() {
    //設定がなければウォレット作成。作成後アプリ設定とアカウント情報を別々にローカルストレージへ
    if(!this.accountConfigLoad()) {
      this.createAccountModal = true;
    }
  }

  private Load() {
    this.accountConfigLoad();
    this.wallet.getBalance().subscribe( (balance) => this.balance = balance );
  }

  private accountConfigLoad(): boolean {
    const storageName = `${this.walletName}-config-data`
    const storage = new DataStorage(storageName);
    // ローカルストレージから設定を読み込む
    const configData = storage.getData;

    // ローカルストレージに設定のデータがあったか確認。
    if (configData) {
      // あればvuex.storeを更新
      this.$store.commit('Config/UPDATE_CONFIG_DATA', configData);
      return true;
    } else {
      // なければアプリ設定の初期値をローカルストレージに登録
     /* const data = this.$store.state.Config;
      storage.setData = data;*/
      return false;
    }
  }

  private accountLoad() {}

  private createAccountAndSet() {
    this.wallet.createAccount(this.walletName, this.walletPassword);
  }
}
</script>

<style scoped>
#nav {
  background-color: #00bfff42;
  box-shadow: -0.5px -0.5px 0.5px 0.5px rgba(85, 145, 160, 0.4);
  display: flex;
}

a {
  text-decoration: none;
  flex-grow: 1;
  color: black;
}

.xem-amount {
  background-color: #00bfff42;
  box-shadow: 1px 1px 5px 0.5px rgba(85, 145, 160, 0.4);
}

/*PC*/
@media screen and (min-width: 701px) {
  a {
    border-bottom: 1px solid#c9ced4;
    border-left: 0.5px solid#c9ced4;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .xem-amount {
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 20px;
    border-top: 1px solid#c9ced4;
    padding-top: 18px;
    padding-bottom: 18px;
  }
}

/*スマホ*/
@media screen and (max-width: 800px) {
  #nav {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  a {
    box-shadow: -0.3px -1.5px 5px 0.5px rgba(85, 145, 160, 0.4);
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .xem-amount {
    text-align: center;
    font-size: 20px;
    padding-top: 18px;
    padding-bottom: 18px;
    width: 100%;
  }
}
</style>
