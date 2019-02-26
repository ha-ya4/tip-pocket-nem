<template>
  <div id="transaction-history">

    <div class=transaction-history v-for="h of history">
      <div class="history">

        <div class="transfer" v-if="!h.otherTransaction">
          {{ h.timeWindow.timeStamp | dateTime }}<br>
          sender: {{ h.signer.address.value }}
          quantity: {{ h._xem.quantity / divisibility }}<br>
          message: {{ h.message.payload }}
        </div><br>

        <div class="multisig-transaction" v-if="h.otherTransaction">
          {{ h.timeWindow.timeStamp | dateTime }} multisig<br>
          sender: {{ h.otherTransaction.signer.address.value }}
          quantity: {{ h.otherTransaction._xem.quantity / divisibility }}<br>
          message: {{ h.otherTransaction.message.payload }}
        </div><br>

      </div>
    </div>

    <div class="add-history-button" v-if="addHistory">
      <button type="button" class="app-button" @click="addHistoryButton">さらに表示</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { Transaction, Pageable } from 'nem-library';

import Wallet from '@/class/wallet/wallet.ts';

@Component({
  filters: {
    // あとで直す
    dateTime(value: any): string {
      const date = value._date;
      const time = value._time;
      const dateTime = `${date._year}-${date._month}-${date._day}/${time._hour}:${time._minute}:${time._second}`;
      return dateTime;
    },
  },
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private addHistory: boolean = true;
  private allHistory: Pageable<Transaction[]> = this.wallet.getAllTransactionsPaginated();
  private divisibility: number = this.wallet.getDivisibility()
  private history: Transaction[] = [];

  private created() {
    this.allHistory.subscribe((history) => {
      console.log(history)
      for (const h of history) {
        this.history.push(h);
      }
    });
  }

  private addHistoryButton() {
    this.allHistory.nextPage()
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  #transaction-history {
    margin: 10px;
  }

  .transaction-history {
  }

  .transfer {
  }

  .add-history-button {
    text-align: center;
    margin-top: 5px;
  }
}
</style>