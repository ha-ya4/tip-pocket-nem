<template>
  <div id="receive-and-withdraw">
    <h1>withdraw</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import Information from '@/components/information.vue';

import { SendParameters } from '@/class/wallet/data-class';
import Wallet from '@/class/wallet/wallet.ts';
import { InformationMessage } from '@/interface.ts';

@Component({
  components: {
    Information,
  },
})
export default class ReceiveAndWithdraw extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;
}
</script>

<style scoped>

</style>