<template>
  <table :class="style.table">
    <thead>
      <tr>
        <td
          v-for="(header, key) in tableHeaders"
          :class="style.tableCell"
          :key="key"
        >
          {{ header }}
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
import { Vue, prop } from 'vue-class-component';
import { BeerSimplified } from '@/types/typings';

class Props {
  beerData: BeerSimplified[] = prop({
    required: true,
  });
}

export default class BeerTable extends Vue.with(Props) {
  get tableHeaders(): string[] {
    return [
      'ID',
      'NAME',
      'FIRST BREWED',
      'ALCOHOL BY VOLUME (ABV)',
      'INTERNATIONAL BITTERING UNIT (IBU)',
      'COLOR UNITS (EBC)',
      'PH',
      'MORE',
    ];
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
</style>
