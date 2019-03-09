<template>
  <div id="transaction-history">

    <!--トランサクションの詳細を表示する-->
    <modal-window
      @modalClose="modalClose"
      :open="modal.open"
      :modalSize="modal.size"
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
            {{ h.timeWindow.timeStamp | fDateTime }}
            <hr>
            <span class="transaction-type">TransferTransaction</span>
            <hr>
            sender:<br>{{ h.signer.address.value }}
            <hr>
            quantity: {{ h._xem.quantity / divisibility }}
            <hr>
            <span v-if="h._assets === undefined || h._assets.length === 0">
              アセットなし
            </span>
            <span v-else>
              アセットあり
            </span>
            <hr>
            message:<br>{{ h.message.plain() | fStringShort }}
            <hr>
          </div>

          <!--マルチシグの場合はこっち-->
          <div class="multisig-transaction" v-if="h.otherTransaction">
            <hr>
            {{ h.timeWindow.timeStamp | fDateTime }}
            <hr>
            <span class="transaction-type">MultisigTransaction</span>
            <hr>
            sender:<br>{{ h.otherTransaction.signer.address.value }}
            <hr>
            quantity: {{ h.otherTransaction._xem.quantity / divisibility }}
            <hr>
            <span v-if="h.otherTransaction._assets === undefined  || h._assets.length === 0">
              アセットなし
            </span>
            <span v-else>
              アセットあり
            </span>
            <hr>
            message:<br>{{ h.otherTransaction.message.plain() | fStringShort }}
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

import Filters from '@/filters.vue';
import ModalWindow from '@/components/modal-window/ModalWindow.vue';
import HistoryDetail from '@/components/modal-window/HistoryDetail.vue';

import Wallet from '@/class/wallet.ts';
import { ModalSize } from '@/types/enum';

@Component({
  components: {
    ModalWindow,
    HistoryDetail,
  },

  mixins: [Filters],
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private addHistory: boolean = true;
  private allHistory: Pageable<Transaction[]> = this.wallet.getAllTransactionsPaginated();
  private divisibility: number = this.wallet.getDivisibility();
  private history: Transaction[] = [];
  private historyDetail: Transaction | null = null;

  private modal: {open: boolean, size: ModalSize} = {
    open: false,
    size: ModalSize.Large,
  };

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
    this.modal.open = true;
  }

  private modalClose() {
    this.modal.open = false;
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