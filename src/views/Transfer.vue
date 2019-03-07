<template>
  <div id="transfer">

    <modal-window
      :open="modal.open"
      :modalSize="modal.size"
    >
      <p style="text-align: center;">秘密鍵が見つかりませんでした</p>
      <import-private-key @modalClose="modalClose"/>
    </modal-window>

    <div v-if="displayQrReader">
      <qrcode-reader @passAddress="setAddressAndConditionallyTransfer"></qrcode-reader>
    </div>

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

    <Information :messages="information"/>

    <!--アドレス入力欄-->
    <p>
      アドレス:<br>
      <input type="text" maxlength="45" v-model="sendParams.address">
    </p>

    <!--数量入力欄-->
    <p>
      数量:<br>
      <input type="text" maxlength="17" v-model="sendParams.amount">
    </p>

    <!--メッセージ入力欄-->
    <p>
      メッセージ:
      <textarea row="1" maxlength="1024" v-model="sendParams.message"></textarea>
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
    <div class="radio-button" v-for="(a, index) of userParams.amount">
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
    <div class="radio-button" v-for="(m, index) of userParams.message">
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
import { Component, Vue, Inject } from 'vue-property-decorator';
import { PlainMessage, EncryptedMessage, NemAnnounceResult } from 'nem-library';

import Information from '@/components/information.vue';
import ImportPrivateKey from '@/components/create-account/ImportPrivateKey.vue';
import QrcodeReader from '@/components/QrcodeReader.vue';
import ModalWindow from '@/components/modal-window/ModalWindow.vue';

import LocalStorage from '@/class/local-storage';
import { InformationData, SendParameters } from '@/types/data-class';
import { Result } from '@/types/enum';
import { ModalSize } from '@/types/enum';
import Wallet from '@/class/wallet.ts';
import { RadioGroupValue } from '@/interface.ts';


@Component({
  components: {
    Information,
    ImportPrivateKey,
    ModalWindow,
    QrcodeReader,
  },
})
export default class Transfer extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private amountLimit: number = this.$store.state.Config.amountLimit;

  // QRリーダーを表示するかどうか
  private displayQrReader: boolean = false;

  private information: InformationData[] = [];

  private modal: {open: boolean, size: ModalSize} = {
    open: false,
    size: ModalSize.Small,
  };

   // 登録しておいたsendButtonの設定
  private sendButton: boolean = this.$store.state.Config.sendButton;

  // sendButtonラジオのラベル
  private sendRadioLabel: string[] = ['on', 'off'];
  // sendButtonラジオのcheckedのon,offを切り替えるためのもの
  private sendRadioChecked: boolean[] = [false, false];

  private sendParams: { address: string, amount: number, message: string } = {
    // 送金先アドレス
    address: '',
    // 送金数量
    amount: this.$store.getters['Config/defaultAmount'],
    // 送金メッセージ
    message: this.$store.getters['Config/defaultMessage'],
  };

  private userParams: { amount: RadioGroupValue[], message: RadioGroupValue[] } = {
    amount: this.$store.state.Config.amount,
    message: this.$store.state.Config.message,
  };

  // sendButtonの設定値を反映させる
  private created() {
    this.sendButton
      ? this.sendRadioChecked[0] = true
      : this.sendRadioChecked[1] = true;
  }

  private afterSendDisposal(response: NemAnnounceResult) {
    this.sendParams.address = '';
    const info = new InformationData('black', Result.Success, '送金に成功しました');
    this.information.push(info);
  }

  private amountRadioChanged(event: any) {
    this.checkChanged(this.userParams.amount, event.target.value);
    this.sendParams.amount = event.target.nextSibling.textContent;
  }

  private messageRadioChanged(event: any) {
    this.checkChanged(this.userParams.message, event.target.value);
    this.sendParams.message = event.target.nextSibling.textContent;
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

  private modalClose() {
    this.modal.open = false;
  }

  // qrリーダーの表示非表示を切り替える
  private qrButton() {
    this.displayQrReader
      ? this.displayQrReader = false
      : this.displayQrReader = true;
  }

  // もしかしたらバランスの取得が遅いこともあるかもなので、this.validation()で残高足りてるか確認して止めずにここで日本語にする
  private sendError(error: any) {
    let err = error.message;
    if (err === 'FAILURE_INSUFFICIENT_BALANCE') { err = '残高が足りません'; }
    const info = new InformationData('red', Result.Error, err);
    this.information.push(info);
  }

  // qrで読み取ったアドレスを受け取る。sendButtonがFALSEならそのまま送金
  private setAddressAndConditionallyTransfer(address: string) {
    this.sendParams.address = address;

    if (!this.sendButton) {
      this.send();
    }
  }

  private send() {
    this.information = [];
    this.validation();
    // errorがあればリターン
    const validationResult = this.information.some((info) => info.result === Result.Error);
    if (validationResult) { return; }

    const message = PlainMessage.create(this.sendParams.message);
    const parameters = new SendParameters(this.sendParams.amount, message, this.sendParams.address);
    const key = LocalStorage.getKey(this.wallet.walletName);
    // プライベートキーがローカルストレージになければインポート画面へ
    if (!key) {
      this.modal.open = true;
      return;
    }

    this.wallet.send(key, parameters).subscribe(
      (res) => this.afterSendDisposal(res),
      (err) => this.sendError(err),
    );
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

  private validation() {
    // 数量に数字が入力されているか
    if (isNaN(this.sendParams.amount)) {
      const error = new InformationData('red', Result.Error, '数量には数字を入力してください');
      this.information.push(error);
    }

    // 設定した送金上限を超えていないか
    if (this.amountLimit < this.sendParams.amount) {
      const error = new InformationData('red', Result.Error, '設定された送金量の上限を超えています');
      this.information.push(error);
    }

    // addressが入力されているか
    if (this.sendParams.address === '') {
      const error = new InformationData('red', Result.Error, 'アドレスが入力されていません');
      this.information.push(error);
    }

    // 先頭がNから始まる40文字か
    const pattern = /^[n,N].{39}$/;
    if (!pattern.test(this.sendParams.address.trim())) {
      const error = new InformationData('red', Result.Error, 'アドレスの形式が間違っています');
      this.information.push(error);
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

  .nis-response {
    text-align: center;
    font-size: 20px;
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
