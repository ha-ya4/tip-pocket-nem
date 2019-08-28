<template>
  <div id="qrcode-reader">

    <qrcode-stream
      @decode="onDecode"
      @init="onInit">
    </qrcode-stream>

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
export default class QrcodeReader extends Vue {
  private errorMessage: string = '';

  private onDecode(decodedString: string) {
    const address = JSON.parse(decodedString).data.addr;
    this.$emit('passAddress', address);
  }

  private async onInit(promise: any) {
    try {
      await promise;
    } catch (err) {
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
</style>