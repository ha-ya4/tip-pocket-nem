<template>
<!--数量と文字数の入力可能文字数を調べる-->
  <div id="radio-button-group">
    <span class="content-title">{{name}}:&ensp;{{defaultItem}}</span>

    <p class="radio-item">
      <input type="radio" name="radio-item">
      <textarea class="textarea" rows="1" cols="" v-model="receivedItems.value1">
        receivedItems.value1
      </textarea>
    </p>

    <p class="radio-item">
      <input type="radio" name="radio-item">
      <textarea rows="1" cols="" v-model="receivedItems.value2">
        receivedItems.value2
      </textarea>
    </p>

    <p class="radio-item">
      <input type="radio" name="radio-item">
      <textarea rows="1" cols="" v-model="receivedItems.value3">
         receivedItems.value3
      </textarea>
    </p>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class RadioButtonGroup extends Vue {
  @Prop() private name: string;
  @Prop() private defaultItem: string;
  @Prop() private receivedItems: {string: string};
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  /*全体*/
  #radio-button-group {
    padding-top: 10px;
    padding-bottom: 5px;
  }

  input[type=radio] {
    display: ;
  }

  textarea {
    border: 0.1px solid #969ca3;
    border-radius: 5px;
  }

  /*設定する項目とデフォルトの値*/
  .content-title {
    font-size: 22px;
    margin-left: 5px;
  }

  /*設定する項目のそれぞれのラジオボタンとテキスト*/
  .radio-item {
    display: block;
    font-size: 18px;
    margin-top: 8px;
    margin-left: 25px;
  }
}
</style>