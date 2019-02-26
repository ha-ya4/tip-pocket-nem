<template>
  <div id="qrcode-reader">
    <qrcode-stream @decode="onDecode"></qrcode-stream>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { QrcodeStream } from 'vue-qrcode-reader';

@Component({
  components: {
    QrcodeStream,
  },
})

export default class QrReader extends Vue {
  private onDecode(decodedString: string) {
    const address = JSON.parse(decodedString).data.addr;
    this.$emit('passAddress', address);
  }
}
</script>

<style scoped>
</style>