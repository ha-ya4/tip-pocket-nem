<template>
  <div id="config">

    <!-- offにするとQR読み込みで即送金（できるなら）-->
    <div id="send-button">

      <span class="config-item">送金ボタン:</span>

      <span class="radio-item">
        <input type="radio" name="send-radio">
        <label>on</label>
      </span>

      <span class="radio-item">
        <input type="radio" name="send-radio">
        <label>off</label>
      </span>

    </div>

    <!-- 数量の登録とデフォルトを決めておける-->
    <radio-button-group
      ref="amountRadio"
      :name="'数量'"
      :defaultItem="defaultAmount"
      :receivedItems="amount"
      :idName="'amount'"
    />

    <!-- メッセージの登録とデフォルトを決めておける-->
    <radio-button-group
      ref="messageRadio"
      :name="'メッセージ'"
      :defaultItem="defaultMessage"
      :receivedItems="message"
      :idName="'message'"
    />

    <div id="save-button">
      <button type="button" class="app-button" @click="save">保存</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import RadioButtonGroup from '@/components/RadioButtonGroup.vue';

interface TypeConfigData {
  sendButton: boolean,
  amountData: object,
  messageData: object,
}

@Component({
  components: {
    RadioButtonGroup,
  },
})
export default class Home extends Vue {
  private sendButton: boolean = this.$store.state.Config.sendButton;
  private defaultAmount: string = this.$store.state.Config.defaultAmount;
  private amount: string = this.$store.state.Config.amount;
  private defaultMessage: string = this.$store.state.Config.defaultMessage;
  private message: string = this.$store.state.Config.message;

  private created() {
   this.$store.commit('Config/registerAmount', {position: 'value1', value: '1000'});
  }

  private updateLocalstorage(configData: TypeConfigData) {}

  private updateStore(configData: TypeConfigData) {}

  // 設定したデータを保存。ローカルストレージとVuexのstoreを更新する
  // $refを使うとproperty dose not exsistが出てしまうがanyで対応
  // type guardを使うのがよさそう？
  private save() {
    const sendButton = this.sendButton;
    const refsAmount: any = this.$refs.amountRadio;
    const amountData = refsAmount.passData();
    const refsMessage: any = this.$refs.messageRadio;
    const messageData = refsMessage.passData();

    const configData = {
      sendButton: this.sendButton,
      amountData: refsAmount.passData(),
      messageData: refsMessage.passData(),
    };

    this.updateLocalstorage(configData);

    this.updateStore(configData);

    console.log(configData);
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

  #save-button {
    text-align:center;
    margin-top: 20px;
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