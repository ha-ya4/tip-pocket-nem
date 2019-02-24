<template>
  <div id="transaction-history">
    <h1>history</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import {  } from 'nem-library';

import Wallet from '@/class/wallet/wallet.ts';

@Component({})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private address: string = this.wallet.address;
 // private transactionHistory: = ;

  private created() {}
}
</script>

<style scoped>

</style>