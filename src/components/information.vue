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

      <div id="delete-button">
        <button type="button" class="app-button" @click="deleteMessage">削除</button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { InformationMessage } from '@/interface.ts';

@Component
export default class Information extends Vue {
  @Prop() private messages: InformationMessage[];

  private deleteMessage(id: number) {
    const length = this.messages.length;
    this.messages.splice(0, length);
  }
}
</script>

<style scoped>
.messages {
  background-color: #f0ebeb56;
  border-radius: 5px;
  box-shadow: 0.5px 0.5px 0.5px 0.5px rgba(0, 11, 14, 0.055);
  margin-top: 5px;
  padding-top: 7px;
  padding-bottom: 2px;
}

.message-content {
  text-align: center;
  padding-top: 7px;
  padding-left: 5px;
}

#delete-button {
  text-align: center;
  font-size: 12px;
}
</style>