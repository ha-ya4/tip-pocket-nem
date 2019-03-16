<template>
  <div id="encrypto-checkbox">
    <input
      type="checkbox"
      id="crypto-checkbox"
      @change="messageCrypto">
    <label for="crypto-checkbox" class="crypto-label">
      <span :class="{ 'plain-message': !encryptoMessage }">メッセージ暗号化</span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class EncryptoCheckbox extends Vue {
  @Prop() private encryptoMessage: boolean;

  private messageCrypto(event: any) {
    this.$emit('messageCrypto', event.target.checked);
  }
}
</script>

<style scoped>
input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:checked + .crypto-label:before {
  opacity: 1;
}

#encrypto-checkbox {
  margin-left: -18px;
}

.crypto-label {
  content: "";
  position: relative;
  padding: 0 0 0 40px;
}

.crypto-label:after, .crypto-label:before {
  position: absolute;
  content: "";
  top: 50%;
}

.crypto-label:after {
  left: 20px;
  margin-top: -6px;
  width: 10px;
  height: 10px;
  border: 2px solid #d1cccc;
  border-radius: 4px;
}

.crypto-label:before {
  left: 23px;
  margin-top: -10px;
  width: 7px;
  height: 12px;
  border-right: 2px solid #60b7f1;
  border-bottom: 2px solid #60b7f1;
  transform: rotate(45deg);
  opacity: 0;
  z-index: 1;
}

.plain-message {
  color: #d1cccc;
}
</style>