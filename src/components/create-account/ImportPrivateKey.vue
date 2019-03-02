<template>
  <div id="import-privatekey">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import Wallet from '@/class/wallet/wallet.ts';

import { CreateAcountPages } from '@/components/create-account/types.ts';
import { InformationMessage } from '@/interface.ts';

@Component({})
export default class ImportPrivateKey extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

}
</script>

<style scoped>
@media screen and (max-width: 800px) {
}
</style>