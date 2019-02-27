<template>

  <div id="modal-window">

    <!--親コンポーネントから渡されたbool値でモーダルの表示、非表示を切り替える-->
    <div :class="{ 'modal-none': !open }">

      <!--オーバーレイのためのdiv。クリックでモーダルが消える-->
      <div class="overlay" @click.stop="modalClose"></div>

      <div id="modal-content">

        <div class="modal-item">
          <!--表示したいものを親コンポーネントからスロットに挿入-->
          <slot></slot>
        </div>

        <div class="close-button">
          <button type="button" class="app-button" @click="modalClose">閉じる</button>
      　</div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Transaction } from 'nem-library';


@Component({})
export default class ModalWindow extends Vue {
  @Prop() private open: boolean;

  // 一度表示してスクロールを動かすと、次に表示するときも前のスクロール位置になってしまうので、beforeUpdateでスクロール位置を０に戻す
  private beforeUpdate() {
    const element = document.getElementById('modal-content') as HTMLElement;
    if (element.scrollTop !== null) { element.scrollTop = 0; }
  }

  // 親のメソッドを呼び出してthis.openをfalseに切り替える。モーダルが消える
  private modalClose() {
    this.$emit('modalClose');
  }
}
</script>

<style scoped>
/*レスポンシブじゃなくていいと思う*/
#modal-content {
  box-sizing: border-box;
  border-top: 25px solid rgb(170, 199, 231);
  border-bottom: 25px solid rgb(170, 199, 231);
  border-radius: 10px;
  background-color: #fdfeff;
  z-index: 2;
  position: fixed;
  width: 90%;
  height: 70%;
  top: 15%;
  left: 5%;
  overflow:auto;
  word-wrap: break-word;
  animation-name: modal-fadein;
  animation-duration: 0.3s;
}

@keyframes modal-fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-item {
  padding: 15px;
}

.modal-none {
  display: none;
}

.close-button {
  text-align: center;
  margin: 15px;
}

.overlay {
  background-color: #0a0a0a;
  z-index: 1;
  opacity: 0.65;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation-name: overlay-fadein;
  animation-duration: 0.3s;
}

@keyframes overlay-fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.65;
  }
}
</style>
