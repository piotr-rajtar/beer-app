<template>
  <span id="test">Bottoms up!</span>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapState } from 'vuex';
import { DebouncedFunc, throttle } from 'lodash';

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
      if (newPageNumber !== 1) {
        return;
      }
      this.pageNumber = 1;
      await this.fetchDataInitially();
      window.addEventListener('scroll', this.onScroll);
    },
    areAllDataFetched: function onDataFetchCompletion(areAllDataFetched: boolean): void {
      if (!areAllDataFetched) {
        return;
      }
      window.removeEventListener('scroll', this.onScroll);
    },
  },
  mounted: async function onMount(): Promise<void> {
    await this.fetchDataInitially();
    window.addEventListener('scroll', this.onScroll);
  },
  unmounted: function onUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
  },
})
export default class BeerTableInfiniteScroll extends Vue.with(Props) {
  getLoadingStatus!: boolean;
  throttledOnLoadMore: DebouncedFunc<() => Promise<void>> = throttle(this.onLoadMore, 300);
  pageNumber: number = 1;

  get numberOfInitialFetchNeeded(): number {
    const beerTable: DOMRect = (document.getElementById('beerTable') as HTMLTableElement).getBoundingClientRect();
    return Math.floor((window.innerHeight - beerTable.top) / beerTable.height);
  }

  isDocumentStartFetchPointReached(): boolean {
    const documentHeightPercentage = 0.9;
    const documentFetchPoint = document.body.offsetHeight * documentHeightPercentage;
    return window.innerHeight + window.scrollY >= documentFetchPoint;
  }

  isFetchNeededAndDataAreLoaded(): boolean {
    return this.isDocumentStartFetchPointReached() && !this.$store.state.loadingStatus;
  }

  onLoadMore(): void {
    this.pageNumber++;
    this.$emit('loadMore');
  }

  async fetchDataInitially(): Promise<void> {
    for (let counter = 0; counter < this.numberOfInitialFetchNeeded; counter++) {
      await this.onLoadMore();
    }
  }

  async onScroll(): Promise<void> {
    if (this.isFetchNeededAndDataAreLoaded()) {
      this.throttledOnLoadMore();
    }
  }
}
</script>
