<template>
  <div id="transfer">

    <modal-window
      :open="modal.open"
      :modalSize="modal.size"
    >
      <p style="text-align: center;">秘密鍵が見つかりませんでした</p>
      <import-private-key @modalClose="modalClose"/>
    </modal-window>

    <div class="qr-reader" v-if="displayQrReader">
      <qrcode-reader @passAddress="setAddressAndConditionallyTransfer"></qrcode-reader>
    </div>

    <!--QRリーダー起動ボタン-->
    <div class="qr-button">
      <button
        type="button"
        class="app-button"
        @click="qrButton">QR</button>
    </div>

    <!--送金ボタンをoffにしたときに表示する警告文-->
    <div class="send-button-none" v-if="!sendButton">
      QRコードを読み取ると確認なしで送金します
    </div>

    <Information :messages="information"/>

    <!--アドレス入力欄-->
    <div class="address">
      <span class="address-string">アドレス</span>:
      <input type="text" maxlength="45" class="app-input-text" v-model="sendParams.address">
    </div>

    <!--数量入力欄-->
    <div class="amount">
      <span class="amount-string">数</span>量:
      <input type="text" maxlength="17" class="app-input-text" v-model="sendParams.amount">
    </div>

    <!--メッセージ入力欄-->
    <div class="message">
      <span class="message-string">メッセージ</span>:
      <input type="text" maxlength="1024"  class="app-input-text" v-model="sendParams.message">
    </div>

    <single-checkbox
      @checkboxChanged="changeEncryptoMessage"
      :item="encryptoMessage"
      :name="'encmess'">
      メッセージ暗号化
    </single-checkbox>

    <single-checkbox
      @checkboxChanged="changeAmountLimitNone"
      :item="amountLimit.none"
      :name="'limitnone'">
      送金上限なし
    </single-checkbox>

    <!--送金ボタン-->
    <div class="send-button" v-if="sendButton">
      <button
        type="button"
        class="app-button"
        @click="send">送金</button>
    </div>

    <!--送金ボタンのon,off設定ボタン-->
    <div>
      <send-radio-button @bool="sendRadioBool" />
    </div>

    <!--設定しておいた数量の中から選択できる-->
    数量：
    <div class="radio-button" v-for="(a, index) of userParams.amount">
      <div>
        <input
          type="radio"
          name="amount-radio"
          :value="index"
          :checked="a.defaultValue"
          @change="amountRadioChanged">
        <label>{{ a.value }}</label>
      </div>
    </div>

    <!--設定しておいたメッセージの中から選択できる-->
    メッセージ：
    <div class="radio-button" v-for="(m, index) of userParams.message">
      <div>
        <input
          type="radio"
          name="message-radio"
          :value="index"
          :checked="m.defaultValue"
          @change="messageRadioChanged">
        <label>{{ m.value }}</label>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { PlainMessage, EncryptedMessage, NemAnnounceResult } from 'nem-library';

import SendRadioButton from '@/components/SendRadioButton.vue';
import SingleCheckbox from '@/views/transfer/SingleCheckbox.vue';
import Information from '@/components/information.vue';
import ImportPrivateKey from '@/components/create-account/ImportPrivateKey.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import QrcodeReader from '@/views/transfer/QrcodeReader.vue';

import LocalStorage from '@/ts/local-storage';
import { InformationData, SendParameters } from '@/types/data-class';
import { Result } from '@/types/enum';
import { ModalSize } from '@/types/enum';
import Wallet from '@/ts/wallet.ts';
import { ConfigValue } from '@/types/data-class';


@Component({
  components: {
    SendRadioButton,
    SingleCheckbox,
    Information,
    ImportPrivateKey,
    ModalWindow,
    QrcodeReader,
  },
})
export default class Transfer extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  // QRリーダーを表示するかどうか
  private displayQrReader: boolean = false;
  private information: InformationData[] = [];
  private encryptoMessage: boolean = false;

  private amountLimit: { limit: number, none: boolean } = {
    limit: this.$store.state.Config.amountLimit,
    none: false,
  };

  private modal: {open: boolean, size: ModalSize} = {
    open: false,
    size: ModalSize.Small,
  };

   // 登録しておいたsendButtonの設定
  private sendButton: boolean = this.$store.state.Config.sendButton;

  private sendParams: { address: string, amount: number, message: string } = {
    // 送金先アドレス
    address: '',
    // 送金数量
    amount: this.$store.getters['Config/defaultAmount'],
    // 送金メッセージ
    message: this.$store.getters['Config/defaultMessage'],
  };

  // ユーザーが登録しておいた数量とメッセージ
  private userParams: { amount: ConfigValue[], message: ConfigValue[] } = {
    amount: this.$store.state.Config.amount,
    message: this.$store.state.Config.message,
  };

  // 送金成功時にアドレス欄をリセットして成功のメッセージを表示する
  private afterSendDisposal(response: NemAnnounceResult) {
    this.sendParams.address = '';
    const info = new InformationData('black', Result.Success, '送金に成功しました');
    this.information.push(info);
  }

  private amountRadioChanged(event: any) {
    this.radioChanged(this.userParams.amount, event.target.value);
    this.sendParams.amount = event.target.nextSibling.textContent;
  }

  private messageRadioChanged(event: any) {
    this.radioChanged(this.userParams.message, event.target.value);
    this.sendParams.message = event.target.nextSibling.textContent;
  }

  // radioボタンのcheckを切り替える
  private radioChanged(userItems: ConfigValue[], index: number) {
    // checkを外す
    for (const item of userItems) {
      item.defaultValue = false;
    }

    // 受け取ったインデックスの位置のdefaultValueをtrueにしてチェックをつける
    userItems[index].defaultValue = true;
  }

  private changeAmountLimitNone(none: boolean) {
    this.amountLimit.none = none;
  }

  private changeEncryptoMessage(encrypto: boolean) {
    this.encryptoMessage = encrypto;
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

    const key = LocalStorage.getKey(this.wallet.walletName);
    // プライベートキーがローカルストレージになければインポート画面へ
    if (!key) {
      this.modal.open = true;
      return;
    }
    const privateKey = this.wallet.decrypto(key);

    let message;
    if (!this.encryptoMessage) {
      // 平文
      message = this.wallet.createPlainMessage(this.sendParams.message);
    } else {
      // 暗号化
      message = this.wallet.createEncryptoMessage(this.sendParams.message, privateKey, this.sendParams.address);
    }

    // メッセージ暗号化のときに相手の公開鍵をアドレスから取得していてobservableで返ってくる
    // class Walletでメッセージを作るメソッドがあるがもう少しいいやり方がないか？
    message.subscribe((mess) => {
      if (!mess) {
        const error = new InformationData('red', Result.Error, '送金先アカウントの情報が取得できませんでした');
        this.information.push(error);
        return;
      }

      const parameters = new SendParameters(this.sendParams.amount, mess, this.sendParams.address);
      this.wallet.send(privateKey, parameters).subscribe(
        (res) => this.afterSendDisposal(res),
        (err) => this.sendError(err),
      );
    });
  }

  private sendRadioBool(bool: boolean) {
    this.sendButton = bool;
  }

  private validation() {
    // 数量に数字が入力されているか
    if (isNaN(this.sendParams.amount)) {
      const error = new InformationData('red', Result.Error, '数量には数字を入力してください');
      this.information.push(error);
    }

    // 設定した送金上限を超えていないか
    // 上限なしにチェックがあればここは無視
    if (!this.amountLimit.none) {
      if (this.amountLimit.limit < this.sendParams.amount) {
        const error = new InformationData('red', Result.Error, '設定された送金量の上限を超えています');
        this.information.push(error);
      }
    }

    // addressが入力されているか
    if (this.sendParams.address === '') {
      const error = new InformationData('red', Result.Error, 'アドレスが入力されていません');
      this.information.push(error);
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 500px) {
  input[type="text"] {
    width: 69%;
  }

  #transfer {
    line-height: 160%;
    margin: 25px;
  }

  .address {
    margin-top: 10px;
  }

  .address-string {
    letter-spacing: 0.1em;
  }

  .amount {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .amount-string {
    letter-spacing: 1.72em;
  }

  .message {
    margin-bottom: 10px;
  }

  .message-string {
    font-size: 0.88em;
  }

  .radio-button {
    margin-top: 5px;
    margin-left: 5%;
  }

  .send-button, .qr-button  {
    margin-bottom: 10px;
    text-align: center;
  }

  .send-button-none {
    text-align: center;
    color: red;
  }

  .send-radio-item {
    margin-left: 10px;
  }
}
</style>
