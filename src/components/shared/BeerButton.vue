<template>
  <button :class="style.button">
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class BeerButton extends Vue {}
</script>

<style scoped lang="scss" module="style">
.button {
  margin-bottom: 20px;
  padding: 10px;
}
</style>
