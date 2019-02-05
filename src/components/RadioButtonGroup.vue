<template>
  <div id="radio-button-group">
    {{name}}
    {{defaultItem}}
    <!-- keyなし警告を消す方法はわからない -->
    <div id="radio-group" v-for="item in items">
      <input type="radio" name="radio-item">{{item}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

interface Amount {
  amount1: number;
  amount2: number;
  amount3: number;
}

interface Message {
  message1: string;
  message2: string;
  message3: string;
}

@Component
export default class RadioButtonGroup extends Vue {
  @Prop() private name: string;
  @Prop() private defaultItem: string | number;
  @Prop() private items: Amount | Message;
}
</script>

<style scoped>

</style>