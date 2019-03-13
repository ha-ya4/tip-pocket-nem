<template>
  <div id="config">
    <div class="group-title">アカウント</div>
    <hr>

    <delete-account/>
    <hr>

    <div class="group-title">アプリ設定</div>
    <hr>

    <!-- offにするとQR読み込みで即送金-->
    <div class="send-button">
      <span class="config-item">送金ボタン:</span>
      <span class="send-radio-item" v-for="label of sendRadio.label">
        <input
          type="radio"
          name="send-radio"
          :value="label"
          :checked="sendRadio.checked[label]"
          @change="sendRadioChanged">
        <label>{{ label }}</label>
      </span>
    </div>
    <hr>

    <div class="amount-limit">
      <span class="config-item">送金上限:</span>&nbsp;
      <input type="text" maxlength="10" class="app-input-text" v-model="amountLimit">
    </div>
    <hr>

    <!-- 数量の登録とデフォルトを決めておける-->
    <radio-button-group
      ref="amountRadio"
      :receivedItems="amount"
      :radioIdName="'amount'"
      :maxLength="10">数量</radio-button-group>
    <hr>

    <!-- メッセージの登録とデフォルトを決めておける-->
    <radio-button-group
      ref="messageRadio"
      :receivedItems="message"
      :radioIdName="'message'"
      :maxLength="1024">メッセージ</radio-button-group>
    <hr>

    <Information :messages="information"/>

    <div class="save-button">
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
import { ConfigData, ConfigValue } from '@/types/data-class';

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
  private amount: ConfigValue[] = this.$store.state.Config.amount;
  // 予め登録しておいて送金画面で選択することができるメッセージ
  private message: ConfigValue[] = this.$store.state.Config.message;
  private information: InformationData[] = [];

  private sendRadio: { label: string[], checked: { on: boolean, off: boolean } } = {
    label: ['on', 'off'],
    checked: { on: false, off: false },
  };

  private created() {
    this.sendButton
      ? this.sendRadio.checked.on = true
      : this.sendRadio.checked.off = true;
  }

  private validation(values: ConfigValue[]) {
    // ---------登録した送金量------------
    // amountが数値になってるかチェック
    if (values.some(
      (value: ConfigValue) => isNaN(Number(value.value)))
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

  private sendRadioChanged(event: any) {
    const value = event.target.value;
    switch (value) {
      case 'on':
        this.sendButton = true;
        this.sendRadio.checked.on = true;
        this.sendRadio.checked.off = false;
        break;
      case 'off':
        this.sendButton = false;
        this.sendRadio.checked.on = false;
        this.sendRadio.checked.off = true;
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

    this.validation(amountData);

    // informationにエラーがあれば設定を保存せずにreturn
    if (this.information.some((info) => info.result === 'error')) { return; }

    const configData = new ConfigData(
      amountData,
      messageData,
      this.sendButton,
      this.amountLimit,
    );

    this.updateLocalStorage(configData);
    this.updateStore(configData);

    const success = new InformationData('black', Result.Success, '設定を保存しました');
    this.information = [];
    this.information.push(success);
  }

  // ローカルストレージに保存してある設定を更新
  private updateLocalStorage(configData: ConfigData) {
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
  private updateStore(configData: ConfigData) {
   this.$store.commit('Config/UPDATE_CONFIG_DATA', configData);
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  input[type="text"] {
    width: 73%;
  }

  #config {
    margin: 25px;
  }

  .amount-limit {
    margin-left: 5px;
  }

  .group-title {
    font-size: 25px;
    margin-top: 30px;
  }

  .send-button {
    margin-left: 5px;
  }

  .save-button {
    text-align: center;
    font-size: 12px;
    margin-top: 20px;
  }
}
</style>