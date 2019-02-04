<template>
  <div id="config">
    <h1>config</h1>
    {{ confirm }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  private confirm: boolean = this.$store.state.Config.confirm;
  private defaultAmount: number = this.$store.getters['Config/defaultAmount'];
  private amount: number = this.$store.state.Config.amount;
  private defaultMessage: string = this.$store.getters['Config/defaultMessage'];
  private message: string = this.$store.state.Config.message;

  private created() {
   this.$store.commit('Config/amountRegister', {position: 'amount1', amount: 1000});
   console.log(this.$store.state.Config.amount.amount1);
  }
}
</script>

<style scoped>

</style>