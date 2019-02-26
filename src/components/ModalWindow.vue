<template>
  <div id="modal-window">

    <div :class="{ 'modal-content': open, 'none': !open }">
      hello
      <div v-if="transaction">
        {{transaction}}
      </div>
      <div class="close-button">
      <button type="button" class="app-button" @click="modalClose">閉じる</button>
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
  @Prop() private transaction: Transaction;

  private modalClose() {
    this.$emit('modalClose');
  }
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
  .modal-content {}

  .none {
    display: none;
  }

  .close-button {
    text-align: center;
  }
}
</style>