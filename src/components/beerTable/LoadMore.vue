<template>
  <button :class="style.button" :disabled="isLoadMoreButtonDisabled" @click="debouncedOnLoadMore()">Load more</button>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapActions } from 'vuex';
import { QueryParams } from '@/types/typings';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

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
      await this.onActivePageChange(newPageNumber);
    },
  },
  mounted: async function onMount(): Promise<void> {
    await this.setLoadMoreButtonState();
  },
})
export default class LoadMore extends Vue.with(Props) {
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;

  debouncedOnLoadMore: DebouncedFunc<() => Promise<void>> = debounce(this.onLoadMore, 300);
  isLoadMoreButtonDisabled: boolean = true;
  pageNumber: number = 1;

  async onActivePageChange(newActivePageNumber: number): Promise<void> {
    if (newActivePageNumber === 1) {
      this.pageNumber = 1;
      await this.setLoadMoreButtonState();
    }
  }

  async onLoadMore(): Promise<void> {
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
