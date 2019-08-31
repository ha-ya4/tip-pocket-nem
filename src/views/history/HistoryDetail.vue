<template>

  <div id="history-detail" v-if="detail">

      <hr>
      {{ detail.timeWindow().timeStamp | fDateTime }}
      <hr>
      <span class="transaction-type">{{ detail.type() }}</span>
      <hr>
      height: {{ detail.height() }}
      <hr>
      hash:<br>{{ detail.hash() }}
      <hr>
      sender:<br>{{ detail.sender() }}
      <hr>
      recipient:<br>{{ detail.recipient() }}
      <hr>
      quantity: {{ detail.quantity() / divisibility | fAddOperator(isSend(detail.sender())) }}
      <hr>
      fee: {{ detail.fee() / divisibility  }}
      <hr>
      message:<br>
      {{ detail.message() | fGetMessage(detail.publicAccount(), wallet) }}
      <hr>

    <div class="close-button">

      <button type="button" class="app-button" @click="modalClose">閉じる</button>

    </div>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';
import { TransferTransaction } from 'nem-library';

import Filters from '@/filters.vue';

import { AppAsset } from '../../views/history/data-class';
import { TransactionInterface } from '../../ts/transaction-type';
import Wallet from '../../ts/wallet';

@Component({
  mixins: [Filters],
})
export default class TransactionHistory extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;
  @Prop() private detail: TransactionInterface;

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
