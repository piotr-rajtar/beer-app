<template>
  <thead>
    <tr>
      <beer-table-header-cell
        v-for="header in tableHeaders"
        :key="header.key"
        :header="header"
        :sort-by="sortBy"
        @sort="onSortClick"
      />
    </tr>
  </thead>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import BeerTableHeaderCell from './BeerTableHeaderCell.vue';
import { SortOptions, SortBy, TableHeaders } from '@/types/typings';

class Props {
  sortBy: SortBy | null = prop({
    required: true,
  });
}

@Options({
  components: { BeerTableHeaderCell },
  emits: ['sort'],
})
export default class BeerTableHeader extends Vue.with(Props) {
  get tableHeaders(): TableHeaders {
    return [
      {
        key: 'id',
        name: 'ID',
      },
      {
        key: 'name',
        name: 'NAME',
      },
      {
        key: 'first_brewed',
        name: 'FIRST BREWED',
      },
      {
        key: 'abv',
        name: 'ALCOHOL BY VOLUME (ABV)',
      },
      {
        key: 'ibu',
        name: 'INTERNATIONAL BITTERING UNIT (IBU)',
      },
      {
        key: 'ebc',
        name: 'COLOR UNITS (EBC)',
      },
      {
        key: 'ph',
        name: 'PH',
      },
      {
        key: 'more',
        name: 'MORE',
      },
    ];
  }

  onSortClick(sortOptions: SortOptions): void {
    this.$emit('sort', sortOptions);
  }
}
</script>
