<template>
  <div id="transfer">
    <form id="target">
      <!--QRリーダー起動ボタン-->
      <p class="transfer-button">
        <button
          type="button"
          class="app-button"
          @click="qrButton">QR</button>
      </p>

      <!--送金ボタンをoffにしたときに表示する警告文-->
      <p class="send-button-none" v-if="offChecked">
        QRコードを読み取ると確認なしで送金します(仮)
      </p>

      <!--アドレス入力欄-->
      <p>
        アドレス:<br>
        <input type="text" maxlength="65">
      </p>

      <!--数量入力欄-->
      <p>
        数量:<br>
        <input type="text" maxlength="17" v-model="sendAmount">
      </p>

      <!--メッセージ入力欄-->
      <p>
        メッセージ:
        <textarea row="1" v-model="sendMessage"></textarea>
      </p>

      <!--送金ボタン-->
      <p class="transfer-button" v-if="onChecked">
        <button
          type="button"
          class="app-button"
          @click="send">送金</button>
      </p>

      <!--送金ボタンのonn,off設定ボタン-->
      <p id="send-radio-button">
      <span class="config-item">送金ボタン:</span>

      <span class="send-radio-item">
        <input
          type="radio"
          name="send-radio"
          value="on"
          :checked="onChecked"
          @change="sendRadioChanged">
        <label>on</label>
      </span>

      <span class="send-radio-item">
        <input
          type="radio"
          name="send-radio"
          value="off"
          :checked="offChecked"
          @change="sendRadioChanged">
        <label>off</label>
      </span>
    </p>

    <!--設定しておいた数量の中から選択できる-->
    数量：
    <div class="radio-button" v-for="(a, index) of amount">
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

    <!--設定しておいたメッセージの中から選択できる-->
    メッセージ：
    <div class="radio-button" v-for="(m, index) of message">
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
  // 予め登録しておいて送金画面で選択することができる数量
  private amount: RadioGroupValue[] = this.$store.state.Config.amount;
  private sendAmount: number = this.$store.getters['Config/defaultAmount'];
  // 予め登録しておいて送金画面で選択することができるメッセージ
  private message: RadioGroupValue[] = this.$store.state.Config.message;
  private sendMessage: string = this.$store.getters['Config/defaultMessage'];
  private sendButton: boolean = this.$store.state.Config.sendButton;
  private onChecked: boolean = false;
  private offChecked: boolean = false;

  private created() {
    this.sendButton ? this.onChecked = true : this.offChecked = true;
  }

  private amountRadioChanged(event: any) {
    this.sendAmount = event.target.nextSibling.textContent;
  }

  private messageRadioChanged(event: any) {
    this.sendMessage = event.target.nextSibling.textContent;
  }

  private qrButton() {
    console.log('qr')
  }

  private send() {
    console.log('send')
  }

  private sendRadioChanged(event: any) {
    const value = event.target.value;
    switch (value) {
      case 'on':
        this.sendButton = true;
        this.onChecked = true;
        this.offChecked = false;
        break;
      case 'off':
        this.sendButton = false;
        this.onChecked = false;
        this.offChecked = true;
        break;
      default:
        break;
    }
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  #transfer {
    margin: 25px;
  }

  input[type="text"] {
    background-color: #eaf0f7;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
    width: 90%;
    margin-top: 5px;
    margin-left: 5%;
  }

  textarea {
    background-color: #eaf0f7;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
    width: 90%;
    margin-top: 5px;
    margin-left: 5%;
  }

  .transfer-button {
    text-align: center;
    font-size: 12px;
  }

  .send-button-none {
    text-align: center;
    font-size: 16px;
    color: red;
  }

  .send-radio-item {
    margin-left: 10px;
  }

  .radio-button {
    margin-top: 10px;
    margin-left: 5%;
  }
}
</style>
