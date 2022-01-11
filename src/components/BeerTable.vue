<template>
  <button :class="style.button" data-test="fetch-button" @click="downloadBeers">
    Click to fetch beer data
  </button>
  <table :class="style.table" data-test="beer-table">
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
    <tbody data-test="table-body">
      <tr v-for="beer in simplifiedBeersData" :key="beer.id">
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

<style scoped lang="scss" module="style">
.button {
  margin-bottom: 20px;
  padding: 10px;
}

.table {
  border-collapse: collapse;
  text-align: center;
}

.tableCell {
  border: 1px solid black;
  padding: 4px;
}
</style>
