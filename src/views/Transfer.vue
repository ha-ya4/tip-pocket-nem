<template>
  <div id="transfer">
    <form id="target">
      <p>
        数量:
        <textarea row="1" maxlength="20" v-model="defaultAmount"></textarea>
      </p>

      <p>
        メッセージ:
        <textarea row="1" v-model="defaultMessage"></textarea>
      </p>

      数量：
      <div v-for="(a, index) of amount">
        <p>
          <input
            type="radio"
            name="amount-radio"
            :value="'value' + index"
            :checked="a.defaultValue"
            @change="amountRadioChanged">
          <label>{{ a.value }}</label>
        </p>
      </div>

      メッセージ：
      <div v-for="(m, index) of message">
        <p>
          <input
            type="radio"
            name="message-radio"
            :value="'value' + index"
            :checked="m.defaultValue"
            @change="messageRadioChanged">
          <label>{{ m.value }}</label>
        </p>
      </div>
    </form>


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Information from '@/components/information.vue';

import { RadioGroupValue, InformationMessage } from '@/interface.ts';


@Component({
  components: {
    Information,
  },
})

export default class Home extends Vue {
  private defaultAmount: number = this.$store.getters['Config/defaultAmount'];
  private defaultMessage: string = this.$store.getters['Config/defaultMessage'];
  // 予め登録しておいて送金画面で選択することができる数量
  private amount: RadioGroupValue[] = this.$store.state.Config.amount;
  // 予め登録しておいて送金画面で選択することができるメッセージ
  private message: RadioGroupValue[] = this.$store.state.Config.message;

  private created() {
  }

  private amountRadioChanged(event: any) {
    console.log(event)
    this.defaultAmount = event.target.nextSibling.textContent;
  }

  private messageRadioChanged(event: any) {
    this.defaultMessage = event.target.nextSibling.textContent;
  }
}
</script>

<style scoped>
textarea {
  background-color: #eaf0f7;
  border: 0.1px solid #969ca3;
  border-radius: 5px;
  width: 90%;
  margin-left: 5%;
}
</style>
