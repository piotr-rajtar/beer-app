<template>
  <nav>
    <button :class="style.button" :disabled="isPrevButtonDisabled" @click="onPrevClick">Prev</button>
    <span :class="style.pageNumber">{{ pageNumber }}</span>
    <button :class="style.button" :disabled="isNextButtonDisabled" @click="onNextClick">Next</button>
  </nav>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import { mapActions } from 'vuex';
import { PaginationButtonState, QueryParams } from '@/types/typings';

class Props {
  activePage = prop({
    type: Number,
    default: 1,
  });
}

@Options({
  emits: ['prevPage', 'nextPage'],
  methods: {
    ...mapActions(['checkIfNextPageAvailable']),
  },
  watch: {
    pageNumber: async function onPageChange(newPage, oldPage) {
      if (oldPage < newPage) {
        const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
          page: newPage + 1,
        });
        await this.setButtonsStatus(PaginationButtonState.NEXT, isNextPageAvailable);
      } else {
        await this.setButtonsStatus(PaginationButtonState.PREV, true);
      }
    },
    activePage: function onPageChange(newPage) {
      if (newPage === 1) {
        this.pageNumber = newPage;
      }
    },
  },
})
export default class Pagination extends Vue.with(Props) {
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;
  isPrevButtonDisabled: boolean = true;
  isNextButtonDisabled: boolean = false;
  pageNumber: number = 1;

  async mounted(): Promise<void> {
    const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
      page: this.pageNumber + 1,
    });
    this.setButtonsStatus(PaginationButtonState.DEFAULT, isNextPageAvailable);
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

  onPrevClick(): void {
    this.pageNumber--;
    this.$emit('prevPage', this.pageNumber);
  }
  onNextClick(): void {
    this.pageNumber++;
    this.$emit('nextPage', this.pageNumber);
  }
}
</script>

<style scoped lang="scss" module="style">
.button {
  width: 50px;
  height: 50px;
}

.pageNumber {
  margin: 0 25px;
}
</style>
