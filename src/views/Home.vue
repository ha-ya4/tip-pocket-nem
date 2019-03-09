<template>
  <div id="home">

    <create-account @modalClose="modalClose" :modalOpen="modalOpen"/>

    <div id="nav">
      <router-link to="/transfer">チップ</router-link>
      <router-link to="/history">履歴</router-link>
      <router-link to="/receive">入金</router-link>
      <router-link to="/config">設定</router-link>
    </div>

    <div class="balance">
      {{ balance }}
    </div>

    <div class="main-contents">
      <router-view/>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import CreateAccount from '@/components/create-account/CreateAccount.vue';

import Wallet from '@/class/wallet.ts';

@Component({
  components: {
    CreateAccount,
  },
})
export default class Home extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private balance: number = 0;
  private modalOpen: boolean = false;

  private created() {
    // dataがなければウォレット作成。あればそのままbalance取得
    if (!this.accountDataLoad()) {
      this.modalOpen = true;
    }

    this.getBalance();
  }

  private accountDataLoad(): boolean {
    const storageName = this.wallet.walletName;
    const accountDataJson = localStorage.getItem(storageName);

    // ローカルストレージにデータがあったか確認。
    if (!accountDataJson) { return false; }
    // あればvuex.storeとthis.walletを更新
    const accountData = JSON.parse(accountDataJson);
    this.$store.commit('Config/UPDATE_CONFIG_DATA', accountData.configData);
    this.wallet.setPublicData = accountData.accountData;
    return true;
  }

  private getBalance() {
    this.wallet.getBalance().subscribe((balance) => this.balance = balance );
  }

  private modalClose() {
    this.modalOpen = false;
  }
}
</script>

<style scoped>
#nav {
  box-shadow: -0.5px -0.5px 0.5px 0.5px rgba(85, 145, 160, 0.4);
  display: flex;
}

a {
  text-decoration: none;
  flex-grow: 1;
  color: black;
}

.balance {
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

  .balance {
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
    background-color: rgb(157, 227, 245);
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
  }

  a {
    box-shadow: -0.3px -1.5px 5px 0.5px rgba(85, 145, 160, 0.4);
    padding-top: 17px;
    padding-bottom: 17px;
  }

  .main-contents {
    margin-top: 80px;
    margin-bottom: 75px;
  }

  .balance {
    background-color: rgb(157, 227, 245);
    text-align: center;
    position: fixed;
    top: 0;
    font-size: 20px;
    padding-top: 18px;
    padding-bottom: 18px;
    width: 100%;
    z-index: 999;
  }
}
</style>
