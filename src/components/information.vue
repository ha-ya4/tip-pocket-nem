<template>
  <div id="information">

    <div class="messages" v-if="messages.length">
      <div v-for="message of messages">
        <p class="message-content">
          <font :color="message.color">
            {{ message.message }}
          </font>
        </p>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { InformationData } from '@/types/data-class.ts';

@Component
export default class Information extends Vue {
  @Prop() private messages: InformationData[];
}
</script>

<style scoped>
.messages {
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

@media screen and (min-width: 501px) {
  .message-content {
    font-size: 1.5em;
  }
}
</style>