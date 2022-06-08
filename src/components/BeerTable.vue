<template>
  <table :class="style.table">
    <thead>
      <tr>
        <td v-for="header in tableHeaders" :class="style.tableCell" :key="header.key">
          {{ header.name }}
          <button
            v-if="isSortButtonVisible(header)"
            :class="isSortClicked(SortDirection.ASC, header.key) ? style.sortClicked : null"
            :data-test="`asc-sort-button-${header.key}`"
            @click="onSortClick(SortDirection.ASC, header.key)"
          >
            ASC
          </button>
          <button
            v-if="isSortButtonVisible(header)"
            :class="isSortClicked(SortDirection.DESC, header.key) ? style.sortClicked : null"
            :data-test="`desc-sort-button-${header.key}`"
            @click="onSortClick(SortDirection.DESC, header.key)"
          >
            DESC
          </button>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="beer in beerData" :key="beer.id">
        <td v-for="key in getSingleBeerObjectKeys(beer)" :class="style.tableCell" :key="key + beer.id">
          {{ beer[key] || '-' }}
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
  TableHeader,
  TableHeaderKey,
  TableHeaders,
} from '@/types/typings';

class Props {
  beerData: BeerSimplified[] = prop({
    required: true,
  });
  sortBy: SortBy | null = prop({
    required: true,
  });
  sortDirection: SortDirection = prop({
    required: true,
  });
}

@Options({
  emits: ['sort'],
})
export default class BeerTable extends Vue.with(Props) {
  SortDirection = SortDirection;

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

  getSingleBeerObjectKeys(beer: BeerSimplified): Array<keyof BeerSimplified> {
    return Object.keys(beer) as Array<keyof BeerSimplified>;
  }

  isSortButtonVisible(header: TableHeader): boolean {
    return header.key !== 'more';
  }

  isSortClicked(sortDirection: SortDirection, sortBy: TableHeaderKey): boolean {
    return this.sortDirection === sortDirection && this.sortBy === sortBy;
  }

  onSortClick(sortDirection: SortDirection, sortBy: TableHeaderKey): void {
    if (sortBy !== 'more') {
      const eventData: SortEventData = {
        sortDirection,
        sortBy,
      };
      this.$emit('sort', eventData);
    }
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
