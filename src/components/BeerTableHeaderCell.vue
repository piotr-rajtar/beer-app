<template>
  <td :class="style.tableCell" :key="header.key">
    <span :class="style.tableHeader">{{ header.name }}</span>
    <beer-table-sort-button
      v-if="isSortButtonVisible"
      :column-header="header.key"
      :data-test="`sort-button-${header.key}`"
      :sort-by="sortBy"
      @sort="onSortClick"
    />
  </td>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { SortDirection, SortEventData, SortBy, TableHeader } from '@/types/typings';
import BeerTableSortButton from './BeerTableSortButton.vue';

class Props {
  header: TableHeader = prop({
    required: true,
    type: Object,
  });
  sortBy: SortBy | null = prop({
    required: true,
  });
}

@Options({
  components: { BeerTableSortButton },
  emits: ['sort'],
})
export default class BeerTableHeaderCell extends Vue.with(Props) {
  get isSortButtonVisible(): boolean {
    return this.header.key !== 'more';
  }

  onSortClick(sortDirection: SortDirection): void {
    if (this.header.key !== 'more') {
      const eventData: SortEventData = {
        sortDirection: sortDirection,
        sortBy: this.header.key,
      };
      this.$emit('sort', eventData);
    }
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
