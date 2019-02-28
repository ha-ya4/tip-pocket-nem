<template>
  <div id="transaction-history">

    <!--トランサクションの詳細を表示する-->
    <modal-window
      @modalClose="modalClose"
      :open="modalOpen"
    >
      <history-detail
        @modalClose="modalClose"
        :historyDetail="historyDetail"
      />
    </modal-window>

    <div class=transaction-history v-for="h of history">

      <div class="history" >
        <a @click="modalContentOpen(h)">
          <div class="transfer" v-if="h._xem">
            <hr>
            {{ h.timeWindow.timeStamp | dateTime }}
            <hr>
            <span class="transaction-type">TransferTransaction</span>
            <hr>
            sender:<br>{{ h.signer.address.value }}
            <hr>
            quantity: {{ h._xem.quantity / divisibility }}
            <hr>
            <span v-if="h._assets === undefined">
              アセットなし
            </span>
            <span v-if="h._assets !== undefined">
              アセットあり
            </span>
            <hr>
            message:<br>{{ h.message.payload | stringShort }}
            <hr>
          </div>

          <!--マルチシグの場合はこっち-->
          <div class="multisig-transaction" v-if="h.otherTransaction">
            <hr>
            {{ h.timeWindow.timeStamp | dateTime }}
            <hr>
            <span class="transaction-type">MultisigTransaction</span>
            <hr>
            sender:<br>{{ h.otherTransaction.signer.address.value }}
            <hr>
            quantity: {{ h.otherTransaction._xem.quantity / divisibility }}
            <hr>
            <span v-if="h.otherTransaction._assets === undefined">
              アセットなし
            </span>
            <span v-if="h.otherTransaction._assets !== undefined">
              アセットあり
            </span>
            <hr>
            message:<br>{{ h.otherTransaction.message.payload }}
            <hr>
          </div>
        </a>
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

import ModalWindow from '@/components/modal-window/ModalWindow.vue';
import HistoryDetail from '@/components/modal-window/HistoryDetail.vue';

import Wallet from '@/class/wallet/wallet.ts';

@Component({
  components: {
    ModalWindow,
    HistoryDetail,
  },

  filters: {
    // あとで直す
    dateTime(value: any): string {
      const date = value._date;
      const time = value._time;
      const dateTime = `${date._year}-${date._month}-${date._day}/${time._hour}:${time._minute}`;
      return dateTime;
    },

    stringShort(str: string): string {
      const length = 25;
      if (length < str.length) {
        return str.substr(0, 25) + '...';
      }

      return str;
    },
  },
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private addHistory: boolean = true;
  private allHistory: Pageable<Transaction[]> = this.wallet.getAllTransactionsPaginated();
  private divisibility: number = this.wallet.getDivisibility();
  private history: Transaction[] = [];
  private historyDetail: Transaction | null = null;
  private modalOpen: boolean = false;

  private created() {
    this.allHistory.subscribe((history) => {
      for (const h of history) {
        this.history.push(h);
      }
    });
  }

  private addHistoryButton() {
    this.allHistory.nextPage();
  }

  private modalContentOpen(transaction: Transaction) {
    this.historyDetail = transaction;
    this.modalOpen = true;
  }

  private modalClose() {
    this.modalOpen = false;
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  a {
    text-decoration: none;
    color: black;
  }

  hr {
    background-color: #bbb;
    border: none;
    height: 1px;
  }

  #transaction-history {
    word-wrap: break-word;
    margin-left: auto;
    margin-right: auto;
    width: 95%;
  }

  .add-history-button {
    text-align: center;
    margin-top: 5px;
  }

  .transaction-history {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .history {
    box-shadow: 0.5px 0.5px 0.5px 0.5px rgba(85, 145, 160, 0.4);
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .transfer {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }

  .transaction-type {
    color: rgba(231, 159, 2, 0.911);
  }
}
</style>