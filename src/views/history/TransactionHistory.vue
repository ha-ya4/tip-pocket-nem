<template>

  <div id="transaction-history">

    <!--トランサクションの詳細を表示する-->
    <modal-window @modalClose="modalClose" :open="modal.open" :modalSize="modal.size">

      <history-detail @modalClose="modalClose" :detail="historyDetail" />

    </modal-window>

    <div class=transaction-history v-for="h of history" @click="modalContentOpen(h)">

      <div :class="{ 'history-send': isSend(h.sender()), 'history-receive': !isSend(h.sender()) }" >

        <a>
          <hr>
          {{ h.timeWindow().timeStamp | fDateTime }}
          <hr>
          <span class="transaction-type">{{ h.type() }}</span>
          <hr>
          sender:<br>{{ h.sender() }}
          <hr>
          quantity: {{ h.quantity() / divisibility | fAddOperator(isSend(h.sender())) }}
          <hr>
            message:<br>
            {{ h.message() | fGetMessage(h.publicAccount(), wallet) | fStringShort }}
          <hr>
        </a>

      </div>

    </div>

    <div class="to-bottom" v-if="addHistory">

      <window-scroll-button :direction="windowScrollDirection" />

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
import ModalWindow from '@/components/ModalWindow.vue';
import HistoryDetail from '@/views/history/HistoryDetail.vue';
import WindowScrollButton from '@/components/WindowScrollButton.vue';

import Wallet from '../../ts/wallet';
import { genarateTransactionType, TransactionInterface, Transfer, Multisig } from '../../ts/transaction-type';
import { ModalSize, ScrollDirection } from '../../types/enum';

@Component({
  components: {
    ModalWindow,
    HistoryDetail,
    WindowScrollButton,
  },

  mixins: [Filters],
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private addHistory: boolean = true;
  private pagebleHistory: Pageable<Transaction[]> = this.wallet.getAllTransactionsPaginated();
  private divisibility: number = this.wallet.getDivisibility();
  private history: TransactionInterface[] = [];
  private historyDetail: TransactionInterface | null = null;
  private latestTransactionHash: string;
  private windowScrollDirection: ScrollDirection = ScrollDirection.Bottom;

  private modal: { open: boolean, size: ModalSize } = {
    open: false,
    size: ModalSize.Large,
  };

  // トランザクション履歴を取得する
  private created() {
    this.pagebleHistory.subscribe((history) => {
      for (const h of history) {
        // MultisigTransactionとTransaferTransaction以外は無視する
        try {
          const transaction = genarateTransactionType(h);
          // なぜか全く同じものがくるときがあるので前のループでプッシュしたトランサクションハッシュと同じならコンテニューする
          const previousHash = this.history[this.history.length - 1];
          if (previousHash) {
            if (previousHash.hash() === h.getTransactionInfo().hash.data) { continue; }
          }

          this.history.push(transaction);
        } catch　(err) {
          // 例外発生時は何もしなくていい
        }
      }

      // 受け取った配列のlengthが１０じゃなければボタンを消す。最後が１０だと失敗するか？
      if (history.length !== 10) {
        this.addHistory = false;
      }
    });
  }

  private addHistoryButton() {
    this.pagebleHistory.nextPage();
  }

  private isSend(address: string): boolean {
    return this.wallet.address === address ? true : false;
  }

  private modalContentOpen(transaction: TransactionInterface) {
    this.historyDetail = transaction;
    this.modal.open = true;
  }

  private modalClose() {
    this.modal.open = false;
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

#transaction-history {
  word-wrap: break-word;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}

.add-history-button {
  text-align: center;
  margin-top: 5px;
}

.transaction-history {
  margin-top: 25px;
  margin-bottom: 25px;
}

.history-send {
  border: 1.5px solid #f87777;
}
.history-receive {
  border: 1.5px solid #7fc2ef;
}

.transaction {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.transaction-type {
  color: rgba(231, 159, 2, 0.911);
}

@media screen and (min-width: 501px) {
  #transaction-history {
    width: 100%;
  }
}
</style>