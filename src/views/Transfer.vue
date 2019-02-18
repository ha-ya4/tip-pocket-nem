<template>
  <div id="transfer">

    <p v-if="displayQrReader">
      <qrcode-reader @passAddress="setAddressAndConditionallyTransfer"></qrcode-reader>
    </p>

    <!--QRリーダー起動ボタン-->
    <p class="transfer-button">
      <button
        type="button"
        class="app-button"
        @click="qrButton">QR</button>
    </p>

    <!--送金ボタンをoffにしたときに表示する警告文-->
    <p class="send-button-none" v-if="!sendButton">
      QRコードを読み取ると確認なしで送金します
    </p>

    <!--アドレス入力欄-->
    <p>
      アドレス:<br>
      <input type="text" maxlength="50" v-model="sendAddress">
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
    <p class="transfer-button" v-if="sendButton">
      <button
        type="button"
        class="app-button"
        @click="send">送金</button>
    </p>

    <!--送金ボタンのon,off設定ボタン-->
    <p id="send-radio-button">
      <span class="config-item">送金ボタン:</span>
      <span class="send-radio-item" v-for="(label, index) of sendRadioLabel">
        <input
          type="radio"
          name="send-radio"
          :value="label"
          :checked="sendRadioChecked[index]"
          @change="sendRadioChanged">
        <label>{{ label }}</label>
      </span>
    </p>

    <!--設定しておいた数量の中から選択できる-->
    数量：
    <div class="radio-button" v-for="(a, index) of userAmount">
      <p>
        <input
          type="radio"
          name="amount-radio"
          :value="index"
          :checked="a.defaultValue"
          @change="amountRadioChanged">
        <label>{{ a.value }}</label>
      </p>
    </div>

    <!--設定しておいたメッセージの中から選択できる-->
    メッセージ：
    <div class="radio-button" v-for="(m, index) of userMessage">
      <p>
        <input
          type="radio"
          name="message-radio"
          :value="index"
          :checked="m.defaultValue"
          @change="messageRadioChanged">
        <label>{{ m.value }}</label>
      </p>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Information from '@/components/information.vue';
import QrcodeReader from '@/components/QrcodeReader.vue';

import { RadioGroupValue, InformationMessage } from '@/interface.ts';


@Component({
  components: {
    Information,
    QrcodeReader,
  },
})

export default class Home extends Vue {
  // 送金先アドレス
  private sendAddress: string = '';
  // 送金数量
  private sendAmount: number = this.$store.getters['Config/defaultAmount'];
  // 送金メッセージ
  private sendMessage: string = this.$store.getters['Config/defaultMessage'];
  // 登録しておいて送金画面で選択することができる数量
  private userAmount: RadioGroupValue[] = this.$store.state.Config.amount;
  // 登録しておいて送金画面で選択することができるメッセージ
  private userMessage: RadioGroupValue[] = this.$store.state.Config.message;
  // 登録しておいたsendButtonの設定
  private sendButton: boolean = this.$store.state.Config.sendButton;
  // sendButtonラジオのラベル
  private sendRadioLabel: string[] = ['on', 'off'];
  // sendButtonラジオのcheckedのon,offを切り替えるためのもの
  private sendRadioChecked: boolean[] = [false, false];
  // QRリーダーを表示するかどうか
  private displayQrReader: boolean = false;

  // sendButtonの設定値を反映させる
  private created() {
    this.sendButton
      ? this.sendRadioChecked[0] = true
      : this.sendRadioChecked[1] = true;
  }

  private amountRadioChanged(event: any) {
    this.checkChanged(this.userAmount, event.target.value);
    this.sendAmount = event.target.nextSibling.textContent;
  }

  private messageRadioChanged(event: any) {
    this.checkChanged(this.userMessage, event.target.value);
    this.sendMessage = event.target.nextSibling.textContent;
  }

  // radioボタンのcheckを切り替える
  private checkChanged(userItems: RadioGroupValue[], index: number) {
    // checkを外す
    for (const item of userItems) {
      item.defaultValue = false;
    }

    // 受け取ったインデックスの位置のdefaultValueをtrueにしてチェックをつける
    userItems[index].defaultValue = true;
  }

  // qrリーダーの表示非表示を切り替える
  private qrButton() {
    this.displayQrReader
      ? this.displayQrReader = false
      : this.displayQrReader = true;
  }

  // qrで読み取ったアドレスを受け取る。sendButtonがFALSEならそのまま送金
  private setAddressAndConditionallyTransfer(address: string) {
    this.sendAddress = address;

    if (!this.sendButton) {
      this.send();
    }
  }

  private send() {
    console.log('send');
  }

  private sendRadioChanged(event: any) {
    const value = event.target.value;
    switch (value) {
      case 'on':
        this.sendButton = true;
        this.sendRadioChecked[0] = true;
        this.sendRadioChecked[1] = false;
        break;
      case 'off':
        this.sendButton = false;
        this.sendRadioChecked[0] = false;
        this.sendRadioChecked[1] = true;
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
