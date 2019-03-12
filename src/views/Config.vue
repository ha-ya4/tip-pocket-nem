<template>
  <div id="config">

    <delete-account/>

    <!-- offにするとQR読み込みで即送金（できるなら）-->
    <div id="send-button">
      <span class="config-item">送金ボタン:</span>

      <span class="radio-item">
        <input
          type="radio"
          name="send-radio"
          value="on"
          :checked="onChecked"
          @change="radioChanged">
        <label>on</label>
      </span>

      <span class="radio-item">
        <input
          type="radio"
          name="send-radio"
          value="off"
          :checked="offChecked"
          @change="radioChanged">
        <label>off</label>
      </span>
    </div>

    <div id="amount-limit">
      <span class="config-item" style="display: block;">送金上限:</span>
      <input type="text" cols="25" maxlength="10" v-model="amountLimit">
    </div>

    <!-- 数量の登録とデフォルトを決めておける-->
    <radio-button-group
      ref="amountRadio"
      :receivedItems="amount"
      :radioIdName="'amount'">数量</radio-button-group>

    <!-- メッセージの登録とデフォルトを決めておける-->
    <radio-button-group
      ref="messageRadio"
      :receivedItems="message"
      :radioIdName="'message'">メッセージ</radio-button-group>

    <Information :messages="information"/>

    <div id="save-button">
      <button type="button" class="app-button" @click="save">保存</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import DeleteAccount from '@/components/DeleteAccount.vue';
import RadioButtonGroup from '@/components/RadioButtonGroup.vue';
import Information from '@/components/information.vue';

import Wallet from '@/class/wallet.ts';
import { InformationData } from '@/types/data-class';
import { Result } from '@/types/enum';
import { TypeConfigData, RadioGroupValue } from '@/interface.ts';

@Component({
  components: {
    DeleteAccount,
    RadioButtonGroup,
    Information,
  },
})
export default class Config extends Vue {
  @Inject('WALLET_SERVICE') private wallet: Wallet;

  private sendButton: boolean = this.$store.state.Config.sendButton;
  // 送金量の上限を決めておける
  private amountLimit: number = this.$store.state.Config.amountLimit;
  // 予め登録しておいて送金画面で選択することができる数量
  private amount: RadioGroupValue[] = this.$store.state.Config.amount;
  // 予め登録しておいて送金画面で選択することができるメッセージ
  private message: RadioGroupValue[] = this.$store.state.Config.message;
  private information: InformationData[] = [];
  private onChecked: boolean = false;
  private offChecked: boolean = false;

  private created() {
    // trueならon、falseならoffにチェックを入れる
    this.sendButton ? this.onChecked = true : this.offChecked = true;
  }

  private validation(values: RadioGroupValue[]) {
    // ---------登録した送金量------------
    // amountが数値になってるかチェック
    if (values.some(
      (value: RadioGroupValue) => isNaN(Number(value.value)))
    ) {
      const amountError = new InformationData('red', Result.Error, '数量には数字を入力してください');
      this.information.push(amountError);
    } else {
      // 数字がstring型の可能性があるのでnumber型に変換
      values.map((value) => { value.value = Number(value.value); });
    }

    // ------------送金上限-----------
    // 数字が入力されているかチェック
    if (isNaN(this.amountLimit)) {
      const amountLimitError = new InformationData('red', Result.Error, '送金上限には数字を入力してください');
      this.information.push(amountLimitError);
      return;
    }

    // 一応number型に変換
    this.amountLimit = Number(this.amountLimit);

    // xemの総発行枚数以下かチェック
    const xemMaxAmount = 8_999_999_999;
    if (xemMaxAmount < this.amountLimit) {
      const amountLimitError = new InformationData('red', Result.Error, 'xemの総発行枚数8,999,999,999より小さい数字を入力してください');
      this.information.push(amountLimitError);
      return;
    }

    // 数量に入力された数字が送金量の上限を超えていないかチェック。送金上限を超えていたときにtrueが返る
    const amountLimitResult = values.some((value) => this.amountLimit < value.value );
    if (amountLimitResult) {
      const amountLimitError = new InformationData('red', Result.Error, '送金上限を超えた数量が入力されています');
      this.information.push(amountLimitError);
      return;
    }
  }

  private radioChanged(event: any) {
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

  // 設定したデータを保存。ローカルストレージとVuexのstoreを更新する
  // $refを使うとproperty dose not exsistが出てしまうがanyで対応
  // type guardを使うのがよさそう？
  private save() {
    this.information = [];

    const refsAmount: any = this.$refs.amountRadio;
    const amountData = refsAmount.passData();
    const refsMessage: any = this.$refs.messageRadio;
    const messageData = refsMessage.passData();

    this.validation(amountData.values);

    // informationにエラーがあれば設定を保存せずにreturn
    if (this.information.some((info) => info.result === 'error')) { return; }

    const configData = {
      amount: amountData.values,
      message: messageData.values,
      sendButton: this.sendButton,
      amountLimit: this.amountLimit,
    };

    this.updateLocalStorage(configData);
    this.updateStore(configData);

    const success = new InformationData('black', Result.Success, '設定を保存しました');
    this.information = [];
    this.information.push(success);
  }

  // ローカルストレージに保存してある設定を更新
  private updateLocalStorage(configData: TypeConfigData) {
    const storageName = this.wallet.walletName;
    const accountDataJson = localStorage.getItem(storageName);
    if (accountDataJson) {
      const accountData = JSON.parse(accountDataJson);
      // ローカルストレージに保存してある設定の部分を新しい設定で書き換える
      accountData.configData = configData;
      const json = JSON.stringify(accountData);
      localStorage.setItem(storageName, json);
    }
  }

  // vuex.storeのstateを更新する
  private updateStore(configData: TypeConfigData) {
   this.$store.commit('Config/UPDATE_CONFIG_DATA', configData);
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  #config {
    margin: 25px;
  }

  #send-button {
    padding-top: 5px;
    padding-bottom: 15px;
  }

  #amount-limit {
    padding-bottom: 5px;
    vertical-align: middle;
  }

  #save-button {
    text-align: center;
    font-size: 12px;
    margin-top: 20px;
  }

  input[type=text] {
    background-color: #eaf0f7;
    font-size: 18px;
    margin-top: 10px;
    margin-left: 35.5px;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
    width: 70%
  }

  textarea {
    background-color: #eaf0f7;
    font-size: 18px;
    margin-top: 10px;
    margin-left: 35.5px;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
  }

  .config-item {
    font-size: 20px;
    margin-left: 5px;
  }

  .radio-item {
    font-size: 18px;
    margin-left: 10px;
  }
}
</style>