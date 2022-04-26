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
    activePage: async function onPageChange(newPage) {
      if (newPage === 1) {
        this.pageNumber = newPage;
        await this.setLoadMoreButtonState();
      }
    },
  },
})
export default class LoadMore extends Vue.with(Props) {
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;
  isLoadMoreButtonDisabled: boolean = true;
  pageNumber: number = 1;
  debouncedOnLoadMore: DebouncedFunc<() => Promise<void>> = debounce(this.onLoadMore, 300);

  async mounted(): Promise<void> {
    await this.setLoadMoreButtonState();
  }

  async setLoadMoreButtonState(): Promise<void> {
    const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
      page: this.pageNumber + 1,
    });
    this.isLoadMoreButtonDisabled = !isNextPageAvailable;
  }

  async onLoadMore(): Promise<void> {
    this.pageNumber++;
    await this.setLoadMoreButtonState();
    this.$emit('loadMore');
  }
}
</script>

<style scoped lang="scss" module="style">
.button {
  padding: 10px 25px;
}
</style>
