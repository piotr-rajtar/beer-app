<template>
  <nav>
    <beer-button :is-disabled="isPrevButtonDisabled" @click="onPrevClick">
      Prev
    </beer-button>
    <span>
      <span
        v-for="page in pages"
        :key="`page_${page}`"
        :class="[style.pageNumber, { [style.activePage]: page === activePage }]"
        @click="onPageClick(page)"
      >
        {{ page }}
      </span>
    </span>
    <beer-button :is-disabled="isNextButtonDisabled" @click="onNextClick">
      Next
    </beer-button>
  </nav>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import BeerButton from '@/components/shared/BeerButton.vue';

class Props {
  isPrevButtonDisabled = prop({
    type: Boolean,
  });
  isNextButtonDisabled = prop({
    type: Boolean,
  });
  pages = prop({
    type: Array,
    default: [],
  });
  activePage = prop({
    type: Number,
  });
}

@Options({
  components: { BeerButton },
  emits: ['prevPage', 'nextPage', 'pageClick'],
})
export default class Pagination extends Vue.with(Props) {
  onPrevClick(): void {
    this.$emit('prevPage');
  }
  onNextClick(): void {
    this.$emit('nextPage');
  }
  onPageClick(page: number): void {
    this.$emit('pageClick', page);
  }
}
</script>

<style scoped lang="scss" module="style">
.pageNumber {
  margin: 0 25px;
  cursor: pointer;
}

.activePage {
  color: blue;
  font-weight: bold;
}
</style>
