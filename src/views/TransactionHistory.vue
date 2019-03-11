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
              message:<br>{{ h.otherTransaction.message.plain() | fStringShort }}
            <hr>
          </div>
        </a>
      </div>

    </div>

    <div class="to-bottom" v-if="addHistory">
      <button type="button" class="to-bottom-button" @click="toBottom">↓</button>
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
  private latestTransactionHash: string;

  private modal: { open: boolean, size: ModalSize } = {
    open: false,
    size: ModalSize.Large,
  };

  // 最後まで履歴を遡ると最初に戻る。最後で止めたいのでハッシュ値を比べて一致したら追加表示するボタンを消す。
  private created() {
    // 一個目のトランサクションはforの中で処理せずに先にthis.historyへプッシュしてページブルから削除
    // 一度だけこの処理をしたいのでfirstTime変数で分岐
    let firstTime = true;
    this.allHistory.subscribe((history) => {
      if (firstTime) {
        this.history.push(history[0]);
        history.shift();
        firstTime = false;
      }
      console.log(history)

      for (const h of history) {
        if (this.history[0].getTransactionInfo().hash.data === h.getTransactionInfo().hash.data) {
          this.addHistory = false;
          break;
        }
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

  private toBottom() {
    const el = document.getElementById('transaction-history');
    if (el) {
      window.scroll(0, el.clientHeight);
    }
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

  .to-bottom {
    position: fixed;
    left: 87%;
    bottom: 70px;
  }

  .to-bottom-button {
    background-color: rgba(162, 230, 247, 0.63);
    box-shadow: 0.5px 0.5px 1px 1px rgba(85, 145, 160, 0.4);
    border-radius: 20px;
    outline: none;
    font-size: 22px;
    border-style: none;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 9px;
    padding-right: 9px;
  }
}
</style>