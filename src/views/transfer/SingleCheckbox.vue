<template>

  <div id="single-checkbox">

    <input type="checkbox" :id="name + 'checkbox'" @change="changed">
    <label :for="name + 'checkbox'" class="label">

      <span :class="{ 'not-checked': !item }">
        <slot></slot>
      </span>

    </label>

  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class SingleCheckbox extends Vue {
  @Prop() private item: boolean;
  @Prop() private name: string;

  private changed(event: any) {
    this.$emit('checkboxChanged', event.target.checked);
  }
}
</script>

<style scoped>
#single-checkbox {
  margin-top: 5px;
  margin-bottom: 5px;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:checked + .label:before {
  opacity: 1;
}

#single-checkbox {
  margin-left: -18px;
}

.label {
  content: "";
  position: relative;
  padding: 0 0 0 40px;
}

.label:after, .label:before {
  position: absolute;
  content: "";
  top: 50%;
}

.label:after {
  left: 20px;
  margin-top: -6px;
  width: 10px;
  height: 10px;
  border: 2px solid #d1cccc;
  border-radius: 4px;
}

.label:before {
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

.not-checked {
  color: #d1cccc;
}
</style>