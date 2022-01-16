<template>
  <button :class="style.button" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['fetch'],
})
export default class FetchButton extends Vue {
  onClick(): void {
    this.$emit('fetch');
  }
}
</script>

<style scoped lang="scss" module="style">
.button {
  margin-bottom: 20px;
  padding: 10px;
}
</style>
