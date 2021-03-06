<template>

  <div id="config">

    <div class="group-title">アカウント</div>
    <hr class="line">

    <delete-account/>
    <hr class="line">

    <div class="group-title">アプリ設定</div>
    <hr class="line">

    <!-- offにするとQR読み込みで即送金-->
    <div class="send-button">

      <send-radio-button @bool="sendRadioBool" />

    </div>
    <hr class="line">

    <div class="amount-limit">

      <span class="config-item">送金上限:</span>&nbsp;
      <label>

        <input type="text" maxlength="10" class="app-input-text" v-model="amountLimit">

      </label>

    </div>
    <hr class="line">

    <!-- 数量の登録とデフォルトを決めておける-->
    <radio-button-group ref="amountRadio" :receivedItems="amount" :maxLength="10" :name="'message'">数量</radio-button-group>
    <hr class="line">

    <!-- メッセージの登録とデフォルトを決めておける-->
    <radio-button-group ref="messageRadio" :receivedItems="message" :maxLength="1024" :name="'amount'">メッセージ</radio-button-group>
    <hr class="line">

    <Information :messages="information"/>

    <div class="save-button">

      <button type="button" class="app-button" @click="save">保存</button>

    </div>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import DeleteAccount from '@/views/config/DeleteAccount.vue';
import RadioButtonGroup from '@/views/config/RadioButtonGroup.vue';
import Information from '@/components/information.vue';
import SendRadioButton from '@/components/SendRadioButton.vue';

import Wallet from '../../ts/wallet';
import { InformationData } from '../../types/data-class';
import { Result } from '../../types/enum';
import { ConfigData, ConfigValue } from '../../types/data-class';

@Component({
  components: {
    DeleteAccount,
    RadioButtonGroup,
    Information,
    SendRadioButton,
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


  private sendRadioBool(bool: boolean) {
    this.sendButton = bool;
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
}
</script>

<style scoped>
.amount-limit {
  margin-left: 5px;
}

.send-button {
  margin-left: 5px;
}

.save-button {
  text-align: center;
  font-size: 12px;
  margin-top: 20px;
}

@media screen and (min-width: 501px) {
  input[type="text"] {
  width: 90%;
}

.group-title {
  font-size: 1.5em;
  margin-top: 40px;
}

.send-button {
  margin-left: 5px;
}

.save-button {
  text-align: center;
}
}
/*スマホ*/
@media screen and (max-width: 500px) {
  input[type="text"] {
    width: 63%;
  }

  #config {
    margin: 25px;
  }

  .group-title {
    font-size: 25px;
    margin-top: 30px;
  }

  .save-button {
    font-size: 12px;
    margin-top: 20px;
  }
}
</style>