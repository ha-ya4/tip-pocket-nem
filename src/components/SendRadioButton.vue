<template>
  <div id="send-radio-button">
    <span class="config-item">送金ボタン:</span>
      <span class="send-radio-item" v-for="label of sendRadio.label">
        <input
          type="radio"
          name="send-radi"
          :value="label"
          :checked="sendRadio.checked[label]"
          @change="sendRadioChanged">
        <label>{{ label }}</label>
      </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class SendRadioButton extends Vue {
  private sendButton: boolean = this.$store.state.Config.sendButton;
  private sendRadio: { label: string[], checked: { on: boolean, off: boolean } } = {
    label: ['on', 'off'],
    checked: { on: false, off: false },
  };

  private created() {
    this.sendButton
      ? this.sendRadio.checked.on = true
      : this.sendRadio.checked.off = true;
  }

  private sendRadioChanged(event: any) {
    const value = event.target.value;
    switch (value) {
      case 'on':
        this.sendButton = true;
        this.sendRadio.checked.on = true;
        this.sendRadio.checked.off = false;
        break;
      case 'off':
        this.sendButton = false;
        this.sendRadio.checked.on = false;
        this.sendRadio.checked.off = true;
        break;
      default:
        break;
    }

    this.$emit('bool', this.sendButton);
  }
}
</script>

<style scoped>
</style>