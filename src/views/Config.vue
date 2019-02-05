<template>
  <div id="config">

    <!-- offにするとQR読み込みで即送金（できるなら）-->
    <div id="send-button">
      <span class="config-item">送金ボタン:</span>
      <span class="radio-item"><input type="radio" name="send-radio">on</span>
      <span class="radio-item"><input type="radio" name="send-radio">off</span>
    </div>

    <!-- 数量の登録とデフォルトを決めておける-->
    <radio-button-group
      :name="'数量'"
      :defaultItem="defaultAmount"
      :items="amount"
    />

    <!-- メッセージの登録とデフォルトを決めておける-->
    <radio-button-group
      :name="'メッセージ'"
      :defaultItem="defaultMessage"
      :items="message"
    />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import RadioButtonGroup from '@/components/RadioButtonGroup.vue';

@Component({
  components: {
    RadioButtonGroup,
  },
})
export default class Home extends Vue {
  private sendButton: boolean = this.$store.state.Config.sendButton;
  private defaultAmount: number = this.$store.getters['Config/defaultAmount'];
  private amount: number = this.$store.state.Config.amount;
  private defaultMessage: string = this.$store.getters['Config/defaultMessage'];
  private message: string = this.$store.state.Config.message;

  private created() {
   this.$store.commit('Config/registerAmount', {position: 'amount1', amount: 1000});
   console.log(this.$store.state.Config.amount.amount1);
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  #config {
    margin-top: 15px;
    background-color: #c2d9f3;
    border-top: 1px solid #dce2e7;
    border-bottom: 1px solid #ccd0d3;
    border-right: 1px solid #ccd0d3;
    border-left: 1px solid #ccd0d3;
    width: 98%;
    margin-left: auto;
    margin-right: auto;
    padding: 15px;
  }

  #send-button {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .config-item {
    font-size: 22px;
    margin-left: 5px;
  }

  .radio-item {
    font-size: 18px;
    margin-left: 10px;
  }
}
</style>