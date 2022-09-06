<template>
  <button :class="style.button" :disabled="isLoadMoreButtonDisabled" @click="debouncedOnLoadMore()">Load more</button>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapActions } from 'vuex';
import { QueryParams } from '@/types/typings';
import { debounce, DebouncedFunc } from 'lodash';

class Props {
  activePage = prop({
    type: Number,
    default: 1,
  });
}

@Options({
  emits: ['loadMore'],
  methods: {
    ...mapActions(['checkIfNextPageAvailable']),
  },
  watch: {
    activePage: async function onActivePageChange(newPageNumber: number): Promise<void> {
      if (newPageNumber !== 1) {
        return;
      }
      this.pageNumber = 1;
      await this.setLoadMoreButtonState();
    },
  },
  mounted: async function onMount(): Promise<void> {
    await this.setLoadMoreButtonState();
  },
})
export default class BeerTableLoadMore extends Vue.with(Props) {
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;

  debouncedOnLoadMore: DebouncedFunc<() => Promise<void>> = debounce(this.onLoadMore, 300);
  isLoadMoreButtonDisabled: boolean = true;
  pageNumber: number = 1;

  async onLoadMore(): Promise<void> {
    if (this.isLoadMoreButtonDisabled) {
      return;
    }
    this.pageNumber++;
    await this.setLoadMoreButtonState();
    this.$emit('loadMore');
  }

  async setLoadMoreButtonState(): Promise<void> {
    const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
      page: this.pageNumber + 1,
    });
    this.isLoadMoreButtonDisabled = !isNextPageAvailable;
  }
}
</script>

<style scoped lang="scss" module="style">
.button {
  padding: 10px 25px;
}
</style>
