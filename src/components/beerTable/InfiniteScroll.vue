<template>
  <span id="test">Bottoms up!</span>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapState } from 'vuex';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

class Props {
  activePage = prop({
    type: Number,
    default: 1,
  });
}

@Options({
  computed: mapState(['areAllDataFetched']),
  emits: ['loadMore'],
  watch: {
    activePage: async function onActivePageChange(newPageNumber: number): Promise<void> {
      await this.onActivePageChange(newPageNumber);
    },
    areAllDataFetched: function onDataFetchCompletion(newStatus: boolean): void {
      this.onDataFetchCompletion(newStatus);
    },
  },
  mounted: async function onMount(): Promise<void> {
    await this.initialFetcher();
    window.addEventListener('scroll', this.onScroll);
  },
  unmounted: function onUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
  },
})
export default class InfinityScroll extends Vue.with(Props) {
  pageNumber: number = 1;
  getLoadingStatus!: boolean;
  debouncedOnLoadMore: DebouncedFunc<() => Promise<void>> = debounce(this.onLoadMore, 300);

  get numberOfInitialFetchNeeded(): number {
    const beerTable: DOMRect = (document.getElementById('beerTable') as HTMLTableElement).getBoundingClientRect();
    return Math.floor((window.innerHeight - beerTable.top) / beerTable.height);
  }

  onLoadMore(): void {
    this.pageNumber++;
    this.$emit('loadMore');
  }

  onDataFetchCompletion(newStatus: boolean): void {
    if (newStatus) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  async initialFetcher(): Promise<void> {
    for (let counter = 0; counter < this.numberOfInitialFetchNeeded; counter++) {
      await this.onLoadMore();
    }
  }

  async onScroll(): Promise<void> {
    const isBottomOfWindowReached = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (isBottomOfWindowReached && !this.$store.state.loadingStatus) {
      this.debouncedOnLoadMore();
    }
  }

  async onActivePageChange(newActivePageNumber: number): Promise<void> {
    if (newActivePageNumber === 1) {
      this.pageNumber = 1;
      await this.initialFetcher();
      window.addEventListener('scroll', this.onScroll);
    }
  }
}
</script>
<style lang="scss" module="style"></style>
