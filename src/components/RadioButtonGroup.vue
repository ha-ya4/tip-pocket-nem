<template>
<!--数量と文字数の入力可能文字数を調べる-->
  <div id="radio-button-group">
    <span class="content-title">
      {{name}}:&ensp;{{thisDefaultItem}}
    </span>

    <form id="target">
      <p class="radio-item">
        <input
          id="radio-item1-checked"
          type="radio"
          name="radio-item" value="item1"
          @change="radioChanged"
        >
        <textarea class="textarea" rows="1" cols="" v-model="receivedItems.value1">
          receivedItems.value1
        </textarea>
      </p>

      <p class="radio-item">
        <input
          id="radio-item2-checked"
          type="radio"
          name="radio-item"
          value="item2"
          @change="radioChanged"
        >
        <textarea rows="1" cols="" v-model="receivedItems.value2">
          receivedItems.value2
        </textarea>
      </p>

      <p class="radio-item">
        <input
          id="radio-item3-checked"
          type="radio"
          name="radio-item"
          value="item3"
          @change="radioChanged"
        >
        <textarea rows="1" cols="" v-model="receivedItems.value3">
          receivedItems.value3
        </textarea>
      </p>
    </form>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

// 全体的にイマイチ
// ID,class名をわかりやすいのに変えたほうがいい？
// このコンポーネントを複数個使ったとき動きがおかしくなるのでまずラジオボタンのID名をmountedで書き換える
// ラジオボタンのチェック時とチェックされている項目が書き換えられたときにデフォルトの値も書き換えるようになってる
// ラジオボタンの数を可変にできないか？
// element.checkedの赤波線が消えないのなんで。

@Component
export default class RadioButtonGroup extends Vue {
  // ラジオボタンのグループ名。
  @Prop() private name: string;
  // デフォルトの値
  @Prop() private defaultItem: string;
  // 登録されている値。型を指定していたが、プロパティを使ったときに出る赤波線を消せなかったのでany
  @Prop() private receivedItems: any;
  // IDを書き換えるときに付与する名前
  @Prop() private idName: string;
  // propを書き換えるのはよくない(?)みたいなので別の変数にデフォルトの値を束縛しなおす
  private thisDefaultItem: string = this.defaultItem;

  // 親コンポーネントで複数このコンポーネントを使う場合、ID名がかぶると@watchがうまく動かない
  // なので、最初にPropで渡されたidNameを元々個々のラジオボタンに振られているID名に付与する
  private mounted() {
    this.setIdName('1', `radio-item1-${this.idName}`);
    this.setIdName('2', `radio-item2-${this.idName}`);
    this.setIdName('3', `radio-item3-${this.idName}`);
  }

  // １つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value1')
  private valueChanged1() {
    const element = document.getElementById(`radio-item1-${this.idName}`);
    if (element) {
      if (element.checked) {
        this.thisDefaultItem = this.receivedItems.value1;
      }
    }
  }

  // ２つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value2')
  private valueChanged2() {
    const element = document.getElementById(`radio-item2-${this.idName}`);
    if (element) {
      if (element.checked) {
        this.thisDefaultItem = this.receivedItems.value2;
      }
    }
  }

  // ２つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value3')
  private valueChanged3() {
    const element = document.getElementById(`radio-item3-${this.idName}`);
    if (element) {
      if (element.checked) {
        this.thisDefaultItem = this.receivedItems.value3;
      }
    }
  }

  // 個々のラジオボタンのIDを取得してID名を書き換える
  private setIdName(idNumber: string, rename: string) {
    const idName = `radio-item${idNumber}-checked`;
    const element = document.getElementById(idName);
    if (element) {
      element.id = rename;
    }
  }

  // ラジオボタンでチェックされた値をデフォルトの値に書き換える
  private radioChanged(event: any) {
    this.thisDefaultItem = event.target.nextSibling.value;
  }
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
    background-color: #eaf0f7;
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