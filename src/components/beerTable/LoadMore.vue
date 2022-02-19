<template>
  <beer-button @click="onLoadMore()"> Load more </beer-button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BeerButton from '@/components/shared/BeerButton.vue';

@Options({ components: { BeerButton }, emits: ['loadMore'] })
export default class LoadMore extends Vue {
  onLoadMore(): void {
    this.$emit('loadMore');
  }
}
</script>

<style scoped lang="scss" module="style"></style>
