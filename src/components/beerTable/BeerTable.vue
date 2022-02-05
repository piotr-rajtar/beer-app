<template>
  <table :class="style.table">
    <thead>
      <tr>
        <td
          v-for="header in tableHeaders"
          :class="style.tableCell"
          :key="header.key"
        >
          {{ header.name }}
          <button
            v-if="header.key !== 'more'"
            :class="isSortClicked('asc', header.key) ? style.sortClicked : null"
            @click="onSortClick('asc', header.key)"
          >
            ASC
          </button>
          <button
            v-if="header.key !== 'more'"
            :class="isSortClicked('dsc', header.key) ? style.sortClicked : null"
            @click="onSortClick('dsc', header.key)"
          >
            DSC
          </button>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="beer in beerData" :key="beer.id">
        <td
          v-for="key in Object.keys(beer)"
          :class="style.tableCell"
          :key="key + beer.id"
        >
          {{ beer[key] }}
        </td>
        <td :class="style.tableCell">More</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import {
  BeerSimplified,
  SortDirection,
  SortEventData,
  SortBy,
} from '@/types/typings';

type TableHeader = Array<{ key: string; name: string }>;

class Props {
  beerData: BeerSimplified[] = prop({
    required: true,
  });
}

@Options({
  emits: ['sort'],
})
export default class BeerTable extends Vue.with(Props) {
  sortDirection: SortDirection = 'none';
  sortBy: SortBy | null = null;

  get tableHeaders(): TableHeader {
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

  isSortClicked(sortDirection: SortDirection, sortBy: SortBy): boolean {
    return this.sortDirection === sortDirection && this.sortBy === sortBy;
  }

  onSortClick(sortDirection: SortDirection, sortBy: SortBy): void {
    const shouldBeApplied: boolean =
      this.sortBy !== sortBy || this.sortDirection !== sortDirection;

    this.sortBy = shouldBeApplied ? sortBy : null;
    this.sortDirection = shouldBeApplied ? sortDirection : 'none';

    const eventData: SortEventData = {
      sortDirection: this.sortDirection,
      sortBy: this.sortBy,
    };
    this.$emit('sort', eventData);
  }
}
</script>

<style scoped lang="scss" module="style">
.table {
  border-collapse: collapse;
  text-align: center;
}

.tableCell {
  border: 1px solid black;
  padding: 4px;
}

.sortClicked {
  background-color: grey;
}
</style>
