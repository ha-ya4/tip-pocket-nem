<template>
  <div id="modal-window">

    <!--親コンポーネントから渡されたbool値でモーダルの表示、非表示を切り替える-->
    <div :class="{ 'modal-none': !open }">

      <!--オーバーレイのためのdiv。クリックでモーダルが消える-->
      <div class="overlay" @click.stop="modalClose"></div>

      <div
        id="modal-content"
        :class="{
          'large': modalSize === 0,
          'middle': modalSize === 1,
          'small': modalSize === 2,
          'minimum': modalSize === 3}">
        <div class="modal-item">
          <!--表示したいものを親コンポーネントからスロットに挿入-->
          <slot></slot>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Transaction } from 'nem-library';

import { ModalSize } from '@/types/enum';

@Component({})
export default class ModalWindow extends Vue {
  @Prop() private open: boolean;
  @Prop() private modalSize: ModalSize;

  // 親のメソッドを呼び出してthis.openをfalseに切り替える。モーダルが消える
  private modalClose() {
    const element = document.getElementById('modal-content') as HTMLElement;
    if (element.scrollTop !== null) { element.scrollTop = 0; }

    this.$emit('modalClose');
  }
}
</script>

<style scoped>
#modal-content {
  box-sizing: border-box;
  border-top: 20px solid rgb(170, 199, 231);
  border-radius: 10px;
  background-color: #fdfeff;
  z-index: 1001;
  position: fixed;
  overflow: scroll;
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

.large {
  width: 90%;
  height: 75%;
  top: 12%;
  left: 5%;
}

.middle {
  width: 90%;
  height: 22em;
  top: 20%;
  left: 5%;
}

.small {
  width: 90%;
  height: 17em;
  top: 28%;
  left: 5%;
}

.minimum {
  width: 90%;
  height: 10em;
  top: 37%;
  left: 5%;
}

.modal-item {
  padding: 15px;
}

.modal-none {
  display: none;
}

.overlay {
  background-color: #0a0a0a;
  z-index: 1000;
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
