<template>
  <div id="history-detail" v-if="historyDetail">

    <div v-if="historyDetail._xem">
      <hr>
      {{ historyDetail.timeWindow.timeStamp | fDateTime }}
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
      quantity: {{ historyDetail._xem.quantity / divisibility | fAddOperator(isSend(historyDetail.signer.address.value)) }}
      <hr>
      fee: {{ historyDetail.fee / divisibility  }}
      <hr>
      message:<br>
      {{ historyDetail.message | fGetMessage(historyDetail.signer, wallet) }}
      <hr>
    </div>

    <!--マルチシグの場合はこっち-->
    <div v-if="historyDetail.otherTransaction">
      <hr>
      {{ historyDetail.timeWindow.timeStamp | fDateTime }}
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
      quantity: {{ historyDetail.otherTransaction._xem.quantity / divisibility | fAddOperator(isSend(historyDetail.otherTransaction.signer.address.value))}}
      <hr>
      fee: {{ historyDetail.otherTransaction.fee / divisibility  }}
      <hr>
      message:<br>
      {{ historyDetail.otherTransaction.message | fGetMessage(historyDetail.otherTransaction.signer, wallet) }}
      <hr>
    </div>

    <div class="close-button">
      <button type="button" class="app-button" @click="modalClose">閉じる</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';
import { TransferTransaction } from 'nem-library';

import Filters from '@/filters.vue';

import { AppAsset } from '@/components/modal-window/data-class';
import Wallet from '@/class/wallet.ts';

@Component({
  mixins: [Filters],
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;
  @Prop() private historyDetail: TransferTransaction;

  private divisibility: number = this.wallet.getDivisibility();

  private isSend(address: string): boolean {
    return this.wallet.address === address ? true : false;
  }

  // 親のメソッドを呼び出してthis.openをfalseに切り替える。モーダルが消える
  private modalClose() {
    this.$emit('modalClose');
  }
}
</script>

<style scoped>
.assets {
  line-height: 1.2;
}

.close-button {
  text-align: center;
  margin: 15px;
}

.transaction-type {
  color: rgba(231, 159, 2, 0.911);
}
</style>
