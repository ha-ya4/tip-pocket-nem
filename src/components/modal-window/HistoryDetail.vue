<template>
  <div id="history-detail" v-if="historyDetail">

    <div class="transfer" v-if="historyDetail._xem">
       <hr>
        {{ historyDetail.timeWindow.timeStamp | dateTime }}
        <hr>
        <span class="transaction-type">TransferTransaction</span>
        <hr>
        height: {{ historyDetail.transactionInfo.height }}
        <hr>
        hash:<br>{{ historyDetail.transactionInfo.hash.data }}
        <hr>
        sender:<br>{{ historyDetail.signer.address.value }}
        <hr>
        recipient:<br>{{ historyDetail.recipient.value }}
        <hr>
        quantity: {{ historyDetail._xem.quantity / divisibility }}
        <hr>
        fee: {{ historyDetail.fee / divisibility }}
        <hr>
        <span v-if="historyDetail._assets === undefined">
          アセットなし
        </span>
        <div v-if="historyDetail._assets !== undefined">
          assets:<br>
          <div class="assets" v-for="asset of historyDetail._assets">
            <nobr>{{ asset.quantity }} </nobr>{{ asset.assetId.namespaceId }}:{{ asset.assetId.name }}
          </div>
        </div>
        <hr>
        message:<br>{{ historyDetail.message.payload }}
        <hr>
    </div>

    <!--マルチシグの場合はこっち-->
    <div class="multisig-transaction" v-if="historyDetail.otherTransaction">
      <hr>
      {{ historyDetail.timeWindow.timeStamp | dateTime }}
      <hr>
      <span class="transaction-type">MultisigTransaction</span>
      <hr>
      height: {{ historyDetail.otherTransaction.transactionInfo.height }}
      <hr>
      hash:<br>{{ historyDetail.otherTransaction.transactionInfo.hash.data }}
      <hr>
      sender:<br>{{ historyDetail.otherTransaction.signer.address.value }}
      <hr>
      recipient:<br>{{ historyDetail.otherTransaction.recipient.value }}
      <hr>
      quantity: {{ historyDetail.otherTransaction._xem.quantity / divisibility }}
      <hr>
      fee: {{ historyDetail.otherTransaction.fee / divisibility }}
      <hr>
      <span v-if="historyDetail.otherTransaction._assets === undefined">
        アセットなし
      </span>
      <div v-if="historyDetail.otherTransaction._assets !== undefined">
        <div class="assets" v-for="asset of historyDetail.otherTransaction._assets">
          <nobr>{{ asset.quantity }} </nobr>{{ asset.assetId.namespaceId }}:{{ asset.assetId.name }}
        </div>
      </div>
      <hr>
      message:<br>{{ historyDetail.otherTransaction.message.payload }}
      <hr>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import { Transaction } from 'nem-library';

import Wallet from '@/class/wallet/wallet.ts';

@Component({
  filters: {
    dateTime(value: any): string {
      const date = value._date;
      const time = value._time;
      const dateTime = `${date._year}-${date._month}-${date._day}/${time._hour}:${time._minute}`;
      return dateTime;
    },
  },
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;
  @Prop() private historyDetail: Transaction;
  private divisibility: number = this.wallet.getDivisibility();
}
</script>

<style scoped>
hr {
    background-color: #bbb;
    border: none;
    height: 1px;
}

.assets {
  line-height: 1.2;
}

.transaction-type {
    color: rgba(231, 159, 2, 0.911);
}
</style>

