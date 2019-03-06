<template>
  <div id="config">

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
      <input type="text" max-length="17" v-model="amountLimit">
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

import RadioButtonGroup from '@/components/RadioButtonGroup.vue';
import Information from '@/components/information.vue';

import Wallet from '@/class/wallet.ts';
import { TypeConfigData, RadioGroupValue, InformationMessage } from '@/interface.ts';

@Component({
  components: {
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
  private information: InformationMessage[] = [];
  private onChecked: boolean = false;
  private offChecked: boolean = false;

  private created() {
    // trueならon、falseならoffにチェックを入れる
    this.sendButton ? this.onChecked = true : this.offChecked = true;
  }

  // amountLimitにエラーがないかチェック
  private amountLimitCheck(values: RadioGroupValue[]) {
    // 数字が入力されているかチェック
    if (isNaN(Number(this.amountLimit))) {
      const amountLimitError = {
          name : 'error',
          message: '送金上限には数字を入力してください',
          color: 'red',
      };
      this.information.push(amountLimitError);
      return;
    }

    // number型に変換
    this.amountLimit = Number(this.amountLimit);

    // 数量に入力された数字が送金料量の上限を超えていないか
    for (const value of values) {
      if (this.amountLimit < value.value) {
        const amountLimitError = {
          name : 'error',
          message: '数量が送金上限を超えています',
          color: 'red',
        };
        this.information.push(amountLimitError);
      }
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

    // amountが数値になってるかチェック
    if (amountData.values.some(
      (amount: RadioGroupValue) => typeof(amount.value) !== 'number' )
    ) {
        const amountError = {
          name : 'error',
          message: '数量には数字を入力してください',
          color: 'red',
        };
        this.information.push(amountError);
    }

    this.amountLimitCheck(amountData.values);

    // informationにエラーがあれば設定を保存せずにreturn
    if (this.information.some((info) => info.name === 'error')) {
      return;
    }

    const configData = {
      amount: amountData.values,
      message: messageData.values,
      sendButton: this.sendButton,
      amountLimit: this.amountLimit,
    };

    this.updateLocalStorage(configData);
    this.updateStore(configData);

    const success = {
      name : 'success',
      message: '設定を保存しました',
      color: 'black',
    };
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