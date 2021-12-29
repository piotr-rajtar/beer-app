<template>
  <button data-test="fetch-button" @click="downloadBeers">
    Click to fetch beer data
  </button>
  <table>
    <thead>
      <tr>
        <td v-for="(header, key) in tableHeaders" :key="key">{{ header }}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="beer in simplifiedBeersData" :key="beer.id">
        <td v-for="key in Object.keys(beer)" :key="key + beer.id">
          {{ beer[key] }}
        </td>
        <td>More</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import { BeerSimplified } from '@/store/store-typings';

@Options({
  methods: {
    ...mapActions(['fetchBeers']),
  },
  computed: {
    ...mapGetters(['getSimplifiedBeersData']),
  },
})
export default class BeerTable extends Vue {
  fetchBeers!: () => void;
  getSimplifiedBeersData!: BeerSimplified[];

  get simplifiedBeersData(): BeerSimplified[] {
    return this.getSimplifiedBeersData;
  }

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

  async downloadBeers(): Promise<void> {
    await this.fetchBeers();
  }
}
</script>

<!-- <style scoped lang="scss">
</style> -->
