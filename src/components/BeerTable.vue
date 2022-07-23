<template>
  <table :class="style.table">
    <beer-table-header :sort-by="sortBy" @sort="onSortClick" />
    <beer-table-body :beerData="beerData" />
  </table>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import BeerTableBody from './BeerTableBody.vue';
import BeerTableHeader from './BeerTableHeader.vue';
import { BeerSimplified, SortOptions, SortBy } from '@/types/typings';

class Props {
  beerData: BeerSimplified[] = prop({
    required: true,
  });
  sortBy: SortBy | null = prop({
    required: true,
  });
}

@Options({
  components: { BeerTableBody, BeerTableHeader },
  emits: ['sort'],
})
export default class BeerTable extends Vue.with(Props) {
  onSortClick(sortOptions: SortOptions): void {
    this.$emit('sort', sortOptions);
  }
}
</script>

<style scoped lang="scss" module="style">
.table {
  border-collapse: collapse;
}
</style>
