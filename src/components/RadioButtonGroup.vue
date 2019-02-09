<template>
<!--数量と文字数の入力可能文字数を調べる
    テキストエリアのバリデーション？
    自動で広がるテキストエリア
    ラジオのなし
    クリックで展開するメニュー-->
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

import { ReceivedItems } from '@/interface.ts';

// ID,class名をわかりやすいのに変えたほうがいい？
// このコンポーネントを複数個使ったとき動きがおかしくなるのでまずラジオボタンのID名をmountedで書き換える
// ラジオボタンのチェック時とチェックされている項目が書き換えられたときにデフォルトの値も書き換えるようになってる
// ラジオボタンの数を可変にできないか？

@Component
export default class RadioButtonGroup extends Vue {
  // ラジオボタンのグループ名。
  @Prop() private name: string;
  // デフォルトの値
  @Prop() private defaultItem: string;
  // 登録されている値。型を指定していたが、プロパティを使ったときに出る赤波線を消せなかったのでany
  @Prop() private receivedItems: ReceivedItems;
  // IDを書き換えるときに付与する名前
  @Prop() private idName: string;
  // propを書き換えるのはよくない(?)みたいなので別の変数にデフォルトの値を束縛しなおす
  private thisDefaultItem: string = this.defaultItem;

  // 親コンポーネントで複数このコンポーネントを使う場合、ID名がかぶると@watchがうまく動かない
  // なので、最初にPropで渡されたidNameを元々個々のラジオボタンに振られているID名に付与する
  // デフォルトの値のラジオボタンにチェックをつける
  private mounted() {
    // １〜３まで順番に数字を渡していく
     for (let i = 1; i < 4; i++) {
      this.setRadioIdName(i, `radio-item${i}-${this.idName}`);
      this.defaultCheckedRadio(i);
    }
  }

  private defaultCheckedRadio(idNumber: number) {
    // id名のラジオボタンエレメント取得
    const element = document.getElementById(`radio-item${idNumber}-${this.idName}`) as HTMLInputElement;
    if (!element) { return; }
    // 取得したラジオボタンの次のtextarea取得
    const radioValue = element.nextSibling as HTMLInputElement;
    if (!radioValue) { return; }
    // デフォルト値とtextareaに入力されている値が一致したラジオボタンにチェックをつける
    if (this.thisDefaultItem === radioValue.value) {
      element.checked = true;
    }
  }

  // 設定値を返す。親から呼ぶ。
  private passData() {
    return {
      defaultValue: this.thisDefaultItem,
      values: this.receivedItems,
    };
  }

  // 個々のラジオボタンのIDを取得してID名を書き換える
  private setRadioIdName(idNumber: number, rename: string) {
    const idName = `radio-item${idNumber}-checked`;
    const element = document.getElementById(idName);
    if (element) {
      element.id = rename;
    }
  }

  // ラジオボタンのチェックが変わったときにチェックされた値をデフォルトの値に書き換える
  private radioChanged(event: any) {
    this.thisDefaultItem = event.target.nextSibling.value;
  }

  // １つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value1')
  private valueChanged1() {
    const element = document.getElementById(`radio-item1-${this.idName}`) as HTMLInputElement;
    if (element.checked) {
      this.thisDefaultItem = this.receivedItems.value1;
    }
  }

  // ２つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value2')
  private valueChanged2() {
    const element =  document.getElementById(`radio-item2-${this.idName}`) as HTMLInputElement;
    if (element.checked) {
      this.thisDefaultItem = this.receivedItems.value2;
    }
  }

  // ２つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('receivedItems.value3')
  private valueChanged3() {
    const element = document.getElementById(`radio-item3-${this.idName}`) as HTMLInputElement;
    if (element.checked) {
      this.thisDefaultItem = this.receivedItems.value3;
    }
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