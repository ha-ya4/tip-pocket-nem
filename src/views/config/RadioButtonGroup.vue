<template>

  <div id="radio-button-group">

    <div class="content-title">

      <!--v-bind:classでthis.expansionがfalseならbefore,trueならafterにclassを切り替える-->
      <button
        :class="{ 'button-rotate-before': !expansion,  'button-rotate-after': expansion }"
        @click="radioExpansion"
      >
        <font size="4"> &#9651;</font>
      </button>

      <slot></slot>: {{ defaultValue }}

    </div>

    <div v-if="expansion">

      <div class="radio-item">

        <input
          :checked="none.defaultValue"
          type="radio"
          :name="name + '-radio1'"
          @change="radioChanged"
        >
        <label>{{ none.value }}</label>

      </div>

      <div class="radio-item">

        <input
          :checked="value1.defaultValue"
          type="radio"
          :name="name + '-radio2'"
          @change="radioChanged"
        >
        <input type="text" :maxlength="maxLength" class="app-input-text" v-model="value1.value">
        <hr class="underline">

      </div>

      <div class="radio-item">

        <input
          :checked="value2.defaultValue"
          type="radio"
          :name="name + '-radio3'"
          @change="radioChanged"
        >
        <input type="text" :maxlength="maxLength" class="app-input-text" v-model="value2.value">
        <hr class="underline">

      </div>

      <div class="radio-item">

        <input
          :checked="value3.defaultValue"
          type="radio"
          :name="name + '-radio4'"
          @change="radioChanged"
        >
        <input type="text" :maxlength="maxLength" class="app-input-text" v-model="value3.value">
        <hr class="underline">

      </div>

    </div>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { ConfigValue } from '../../types/data-class';

@Component({})
export default class RadioButtonGroup extends Vue {
  @Prop() private receivedItems: ConfigValue[];
  @Prop() private maxLength: number;
  @Prop() private name: string;

  private expansion: boolean = false;
  private none: ConfigValue = this.receivedItems[0];
  private value1: ConfigValue  = Object.assign({}, this.receivedItems[1]);
  private value2: ConfigValue = Object.assign({}, this.receivedItems[2]);
  private value3: ConfigValue = Object.assign({}, this.receivedItems[3]);
  private defaultValue: string | number = 0;

  // デフォルト値をセットする
  private created() {
    // defaultValueがtrueのものを探してthis.deFaultValueにセットする
    const items = [this.none, this.value1, this.value2, this.value3];
    for (const item of items) {
      if (item.defaultValue === true) {
        this.defaultValue = item.value;
        break;
      }
    }
  }

  // 設定値を返す。親から呼ぶ。
  private passData(): ConfigValue[] {
    return [this.none, this.value1, this.value2, this.value3];
  }

  // ラジオボタンのチェックが変わったときにチェックされた値をデフォルトの値に書き換える
  // 手動でラジオボタンのチェックを変える
  private radioChanged(event: any) {
    // 前回どこがチェックされていたかわからないので全てのdefaultValueをfalseに変える
    const items = [this.none, this.value1, this.value2, this.value3];
    items.forEach((item) => item.defaultValue = false);

    // target.valueの値を取得してifで対応する項目のdefaultValueをtrueに切り替え
    const name = event.target.name;
    switch (name) {
      case this.name + '-radio1':
        this.none.defaultValue = true;
        break;
      case this.name + '-radio2':
        this.value1.defaultValue = true;
        break;
      case this.name + '-radio3':
        this.value2.defaultValue = true;
        break;
      case this.name + '-radio4':
        this.value3.defaultValue = true;
        break;
      default:
        break;
    }

    // デフォルト値をチェックされた値に変更
    this.defaultValue = event.target.nextSibling.value;
  }

  private radioExpansion() {
    this.expansion ? this.expansion = false : this.expansion = true;
  }
}
</script>

<style scoped>
button {
  background-color: transparent;
  color: #959fad;
  outline: none;
  border-style: none;
}

/*ボタンの向きを右にする。*/
.button-rotate-before {
  transform: rotate(90deg);
  transition: 0.05s;
}

/*ボタンクリックで向きを下に回転させる*/
.button-rotate-after {
  transform: rotate(180deg);
  transition: 0.05s;
}

/*設定する項目とデフォルトの値*/
.content-title {
  margin-left: 5px;
  margin-bottom: 3px;
}

/*設定する項目のそれぞれのラジオボタンとテキスト*/
.radio-item {
  margin-top: 8px;
  margin-left: 25px;
}

@media screen and (min-width: 501px) {
  input[type="text"] {
  width: 94%;
}
}

/*スマホ*/
@media screen and (max-width: 500px) {
  input[type="text"] {
    width: 80%;
  }

  /*設定する項目とデフォルトの値*/
  .content-title {
    margin-left: 5px;
    margin-bottom: 3px;
  }

  /*設定する項目のそれぞれのラジオボタンとテキスト*/
  .radio-item {
    margin-top: 8px;
    margin-left: 25px;
  }
}
</style>