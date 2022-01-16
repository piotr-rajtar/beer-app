<template><div :class="style.spinner" /></template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Loader extends Vue {}
</script>

<style scoped lang="scss" module="style">
.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #ffa516 94%, #0000) top/8px 8px
      no-repeat,
    conic-gradient(#0000 30%, #ffa516);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: s3 1s infinite linear;
}

@keyframes s3 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
