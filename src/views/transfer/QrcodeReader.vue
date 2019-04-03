<template>
  <div id="qrcode-reader">
    <div :class="{ failure: !QRreader }">
      <qrcode-stream
        :paused="paused"
        @decode="onDecode"
        @init="onInit">
      </qrcode-stream>
    </div>

    <div class="error-message" v-if="errorMessage !== ''">{{ errorMessage }}</div>
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
  private errorMessage: string = '';
  private paused: boolean = false;
  private QRreader: boolean = false;

  private onDecode(decodedString: string) {
    this.paused = true;

    setTimeout(() => {
      this.paused = false;
    }, 3000);

    const address = JSON.parse(decodedString).data.addr;
    this.$emit('passAddress', address);
  }

  private async onInit(promise: any) {
    try {
      await promise;
      this.QRreader = true;
      this.errorMessage = '';
    } catch (err) {
      this.QRreader = false;

      if (err.name === 'NotAllowedError') {
        this.errorMessage = 'カメラへのアクセス権がありません';
        return;
      }

      if (err.name === 'NotFoundError') {
        this.errorMessage = 'カメラが見つかりません';
        return;
      }

      if (err.name !== '') {
        this.errorMessage = err.name;
      }
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  text-align: center;
}

.failure {
  margin-top: -50%
}
</style>