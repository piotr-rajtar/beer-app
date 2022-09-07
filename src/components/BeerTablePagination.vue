<template>
  <nav>
    <button :class="style.button" :disabled="isPrevButtonDisabled" @click="debouncedOnPrevClick()">Prev</button>
    <span :class="style.pageNumber">{{ pageNumber }}</span>
    <button :class="style.button" :disabled="isNextButtonDisabled" @click="debouncedOnNextClick()">Next</button>
  </nav>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapActions } from 'vuex';
import { PaginationButtonState, QueryParams } from '@/types/typings';
import { debounce, DebouncedFunc } from 'lodash';

class Props {
  activePage = prop({
    type: Number,
    default: 1,
  });
}

@Options({
  emits: ['nextPage', 'prevPage'],
  methods: {
    ...mapActions(['checkIfNextPageAvailable']),
  },
  watch: {
    activePage: function onActivePageChange(newPageNumber: number): void {
      if (newPageNumber !== 1) {
        return;
      }
      this.pageNumber = 1;
    },
    pageNumber: async function onPageChange(newPage, oldPage) {
      await this.onPageChange(newPage, oldPage);
    },
  },
  mounted: async function onMount(): Promise<void> {
    await this.setPaginationButtonState();
  },
})
export default class BeerTablePagination extends Vue.with(Props) {
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;

  debouncedOnPrevClick: DebouncedFunc<() => void> = debounce(this.onPrevClick, 300);
  debouncedOnNextClick: DebouncedFunc<() => void> = debounce(this.onNextClick, 300);
  isNextButtonDisabled: boolean = false;
  isPrevButtonDisabled: boolean = true;
  pageNumber: number = 1;

  onNextClick(): void {
    if (this.isNextButtonDisabled) {
      return;
    }
    this.pageNumber++;
    this.$emit('nextPage');
  }

  onPrevClick(): void {
    if (this.isPrevButtonDisabled) {
      return;
    }
    this.pageNumber--;
    this.$emit('prevPage');
  }

  setButtonsStatus(buttonState: PaginationButtonState, isNextPageAvailable: boolean): void {
    switch (buttonState) {
      case PaginationButtonState.DEFAULT:
      default:
        this.isPrevButtonDisabled = true;
        this.isNextButtonDisabled = !isNextPageAvailable;
        return;
      case PaginationButtonState.PREV:
        this.isPrevButtonDisabled = this.pageNumber === 1;
        this.isNextButtonDisabled = false;
        return;
      case PaginationButtonState.NEXT:
        this.isPrevButtonDisabled = false;
        this.isNextButtonDisabled = !isNextPageAvailable;
        return;
    }
  }

  async onPageChange(newPage: number, oldPage: number): Promise<void> {
    if (oldPage < newPage) {
      const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
        page: newPage + 1,
      });
      this.setButtonsStatus(PaginationButtonState.NEXT, isNextPageAvailable);
    } else {
      this.setButtonsStatus(PaginationButtonState.PREV, true);
    }
  }

  async setPaginationButtonState(): Promise<void> {
    const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
      page: this.pageNumber + 1,
    });
    this.setButtonsStatus(PaginationButtonState.DEFAULT, isNextPageAvailable);
  }
}
</script>

<style scoped lang="scss" module="style">
.button {
  padding: 10px;
}

.pageNumber {
  margin: 0 25px;
}
</style>
