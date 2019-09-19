<template>

  <div id="window-scroll-button">

    <button type="button" class="scroll-button" @click="scroll">{{ direction }}</button>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { ScrollDirection } from '@/types/enum';

@Component({})
export default class WindowScrollButton extends Vue {
  @Prop() private direction: ScrollDirection;

  private scroll() {
    if (this.direction === ScrollDirection.Top) {
      const windowTop = 0;
      window.scroll(0, windowTop);
    } else if (this.direction === ScrollDirection.Bottom) {
      const windowBottom = document.documentElement.offsetHeight;
      window.scroll(0, windowBottom);
    }
  }
}
</script>

<style scoped>
.scroll-button {
  position: fixed;
  left: 87%;
  bottom: 70px;
  background-color: rgba(162, 230, 247, 0.63);
  box-shadow: 0.5px 0.5px 1px 1px rgba(85, 145, 160, 0.4);
  border-radius : 100%;
  outline: none;
  font-size: 22px;
  border-style: none;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 9px;
  padding-right: 9px;
}
</style>