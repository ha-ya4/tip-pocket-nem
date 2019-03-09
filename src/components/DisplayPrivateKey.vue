<template>
  <div id="display-private-key">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import Filters from '@/filters.vue';

import Wallet from '@/class/wallet.ts';

@Component({
  mixins: [Filters],
})
export default class DeleteAccount extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;
}
</script>

<style scoped>
</style>