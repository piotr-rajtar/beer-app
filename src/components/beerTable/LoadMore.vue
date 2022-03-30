<template>
  <beer-button :is-disabled="isLoadMoreButtonDisabled" @click="onLoadMore()">
    Load more
  </beer-button>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import BeerButton from '@/components/shared/BeerButton.vue';

class Props {
  isLoadMoreButtonDisabled = prop({ type: Boolean });
}

@Options({ components: { BeerButton }, emits: ['loadMore'] })
export default class LoadMore extends Vue.with(Props) {
  onLoadMore(): void {
    this.$emit('loadMore');
  }
}
</script>

<style scoped lang="scss" module="style"></style>
