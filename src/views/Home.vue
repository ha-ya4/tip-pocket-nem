<template>
  <div id="home">

    <create-account @modalClose="modalClose" :modalOpen="modalOpen"/>

    <div id="nav">
      <router-link to="/transfer">チップ</router-link>
      <router-link to="/history">履歴</router-link>
      <router-link to="/receive">入金</router-link>
      <router-link to="/config">設定</router-link>
    </div>

    <div class="balance-box">
      <div class="balance">{{ balance }}</div>

      <button type="button" class="balance-button" @click="getBalance">
        <span v-if="!updateBalance">
          <img src="../assets/gray-circle.png" width="22px">
        </span>
        <span v-if="updateBalance">
          <img src="../assets/gray-update.png" width="22px" class="update-balance">
        </span>
      </button>
    </div>

    <div class="main-contents">
      <router-view/>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import CreateAccount from '@/components/create-account/CreateAccount.vue';

import Wallet from '../ts/wallet';

@Component({
  components: {
    CreateAccount,
  },
})
export default class Home extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private balance: number = 0;
  private updateBalance: boolean = false;
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

  private modalClose() {
    this.modalOpen = false;
  }

  private getBalance() {
    this.updateBalance = true;
    if (this.wallet.address !== '') {
      this.wallet.getBalance().subscribe((balance) => {
        this.balance = balance;
        this.updateBalance = false;
      });
    }
  }
}
</script>

<style scoped>
#nav {
  display: flex;
  background-color: #a5d1f4;
  text-align: center;
  position: fixed;
  z-index: 999;
}

a {
  text-decoration: none;
  flex-grow: 1;
  color: black;
}

.balance-box {
  background-color: #a5d1f4;
  position: fixed;
  z-index: 999;
}


@media screen and (min-width: 501px) {
  #nav {
    width: 70%;
    top: 0;
  }

  a {
    border-bottom: 1px solid#c9ced4;
    border-left: 0.5px solid#c9ced4;
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .balance {
    background-color: transparent;
    padding-top: 15px;
    padding-bottom: 15px;
    text-align: center;
  }

  .balance-box {
    bottom: 0;
    width: 70%;
  }

  .balance-button {
    background-color: transparent;
    border-style: none;
    color: rgb(243, 166, 22);
    position: absolute;
    left: 95%;
    top: 26%;
    outline: none;
  }

  .main-contents {
    margin-top: 7%;
    margin-bottom: 7%;
  }
}

@media screen and (max-width: 500px) {
  #nav {
    background-color: #a5d1f4;
    bottom: 0;
    width: 100%;
    z-index: 999;
  }

  a {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .balance {
    background-color: transparent;
    margin-top: 13px;
    text-align: center;
  }

  .balance-box {
    top: 0;
    height: 45px;
    width: 100%;
  }

  /*うまく配置できなかったのでmarginで*/
  .balance-button {
    background-color: transparent;
    border-style: none;
    color: rgb(243, 166, 22);
    position: absolute;
    left: 88%;
    bottom: 5.2px;
    outline: none;
  }

  .main-contents {
    margin-top: 70px;
    margin-bottom: 75px;
  }

  .update-balance {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
}
</style>
