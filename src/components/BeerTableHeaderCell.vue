<template>
  <td :class="style.tableCell" :key="headerKey">
    <span :class="style.tableHeader">{{ headerName }}</span>
    <beer-table-sort-button
      v-if="shouldSortButtonRender"
      :column-header="headerKey"
      :data-test-id="`sort-button-${headerKey}`"
      :sort-by="sortBy"
      @sort="onSortClick"
    />
  </td>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { SortDirection, SortOptions, SortBy, TableHeaderKey } from '@/types/typings';
import BeerTableSortButton from './BeerTableSortButton.vue';

class Props {
  headerKey: TableHeaderKey = prop({ required: true });
  headerName: string = prop({ required: true });
  sortBy: SortBy | null = prop({ required: true });
}

@Options({
  components: { BeerTableSortButton },
  emits: ['sort'],
})
export default class BeerTableHeaderCell extends Vue.with(Props) {
  get shouldSortButtonRender(): boolean {
    return this.headerKey !== 'more';
  }

  onSortClick(sortDirection: SortDirection): void {
    if (this.headerKey === 'more') {
      return;
    }
    const sortOptions: SortOptions = {
      sortDirection: sortDirection,
      sortBy: this.headerKey,
    };
    this.$emit('sort', sortOptions);
  }
}
</script>

<style scoped lang="scss" module="style">
.tableCell {
  border: 1px solid black;
  padding: 4px;

  &:hover :last-child {
    visibility: visible;
  }
}

.tableHeader {
  margin-right: 10px;
}
</style>
