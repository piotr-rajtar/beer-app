<template>
  <tbody>
    <tr v-for="beer in beerData" :key="beer.id">
      <td v-for="key in getBeerObjectKeys(beer)" :class="style.tableCell" :key="`${key}_${beer.id}`">
        {{ getBeerTableCellContent(beer[key]) }}
      </td>
      <td :class="style.tableCell">More</td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { BeerSimplified } from '@/types/typings';

class Props {
  beerData: BeerSimplified[] = prop({
    required: true,
  });
}

@Options({})
export default class BeerTableBody extends Vue.with(Props) {
  getBeerObjectKeys(beer: BeerSimplified): Array<keyof BeerSimplified> {
    return Object.keys(beer) as Array<keyof BeerSimplified>;
  }

  getBeerTableCellContent(keyValue: string | number | null): string | number {
    return keyValue || '-';
  }
}
</script>

<style scoped lang="scss" module="style">
.tableCell {
  border: 1px solid black;
  padding: 4px;
}
</style>
