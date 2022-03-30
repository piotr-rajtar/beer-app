<template>
  <button :class="style.button" :disabled="isDisabled">
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
  isDisabled = prop({ type: Boolean });
}

export default class BeerButton extends Vue.with(Props) {}
</script>

<style scoped lang="scss" module="style">
.button {
  margin-bottom: 20px;
  padding: 10px;
}
</style>
