<template>
  <div id="infomation">
    <div v-for="message of messsges" :key="message.id"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Message } from '@/interface.ts';

@Component
export default class Information extends Vue {
  @Prop() private messages: Message[];
}
</script>

<style scoped>

</style>