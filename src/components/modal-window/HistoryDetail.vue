<template>
  <div id="history-detail" v-if="historyDetail">

    <div class="transfer" v-if="historyDetail._xem">
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
      quantity: {{ historyDetail._xem.quantity / divisibility }}
      <hr>
      fee: {{ historyDetail.fee / divisibility }}
      <hr>
      <span v-if="assets.length === 0">
        アセットなし
      </span>
      <div v-if="assets.length !== 0">
        assets:<br>
        <div class="assets" v-for="asset of assets">
          <nobr>{{ asset.quantity }} </nobr>{{ asset.namespace }}:{{ asset.name }}
        </div>
      </div>
      <hr>
      message:<br>{{ historyDetail.message.payload }}
      <hr>
    </div>

    <!--マルチシグの場合はこっち-->
    <div class="multisig-transaction" v-if="historyDetail.otherTransaction">
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

    <div class="close-button">
      <button type="button" class="app-button" @click="modalClose">閉じる</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
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

  private assets: AppAsset[] = [];
  private divisibility: number = this.wallet.getDivisibility();

  /* // 一旦アセットをthis.assetsにいれる。それから可分性かけてthis.assetsをv-forに渡す。
  // observableでうまいことやる方法が思いつかないのでこうなる
  // マルチシグ分も忘れずに
  private beforeUpdate() {
    try {
      for (let a of this.historyDetail.assets()) {
        const asset = new AppAsset(a.assetId.namespaceId, a.assetId.name, a.quantity);
        this.assets.push(asset);
      }
    // 例外発生時は何もしなくて良い
    } catch {}
  }
  */

  // 親のメソッドを呼び出してthis.openをfalseに切り替える。モーダルが消える
  private modalClose() {
    this.$emit('modalClose');
  }
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

.close-button {
  text-align: center;
  margin: 15px;
}

.transaction-type {
  color: rgba(231, 159, 2, 0.911);
}
</style>
