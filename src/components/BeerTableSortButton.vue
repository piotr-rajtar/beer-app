<template>
  <button
    :class="[style.sortButton, isSortButtonClicked ? style.sortClicked : style.sortNotClicked]"
    :data-test-id="`beer-table-sort-button__${columnHeader}`"
    @click="onSortButtonClick()"
  >
    {{ sortButtonTitle }}
  </button>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { SortDirection, SortBy, TableHeaderKey } from '@/types/typings';

class Props {
  columnHeader: TableHeaderKey = prop({
    required: true,
  });
  sortBy: SortBy | null = prop({
    required: true,
  });
}

@Options({
  emits: ['sort'],
  watch: {
    sortBy: function onSortByChange(newColumnToSort: SortBy): void {
      if (newColumnToSort === this.columnHeader) {
        return;
      }
      this.sortButtonDirection = SortDirection.NONE;
    },
  },
})
export default class BeerTableSortButton extends Vue.with(Props) {
  sortButtonDirection: SortDirection = SortDirection.NONE;

  get isSortButtonClicked(): boolean {
    return this.sortButtonDirection !== SortDirection.NONE;
  }

  get sortButtonTitle(): string {
    switch (this.sortButtonDirection) {
      case SortDirection.ASC:
      case SortDirection.NONE:
      default:
        return 'ASC';
      case SortDirection.DESC:
        return 'DESC';
    }
  }

  getNewSortButtonDirection(currentSortButtonDirection: SortDirection): SortDirection {
    switch (currentSortButtonDirection) {
      case SortDirection.ASC:
        return SortDirection.DESC;
      case SortDirection.DESC:
        return SortDirection.NONE;
      case SortDirection.NONE:
      default:
        return SortDirection.ASC;
    }
  }

  onSortButtonClick(): void {
    this.setSortButtonDirection(this.sortButtonDirection);
    this.$emit('sort', this.sortButtonDirection);
  }

  setSortButtonDirection(currentSortButtonDirection: SortDirection): void {
    this.sortButtonDirection = this.getNewSortButtonDirection(currentSortButtonDirection);
  }
}
</script>

<style scoped lang="scss" module="style">
.sortButton {
  width: 50px;
  visibility: hidden;
}

.sortClicked {
  visibility: visible;
}

.sortNotClicked {
  opacity: 0.5;
}
</style>
