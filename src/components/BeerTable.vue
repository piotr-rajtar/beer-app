<template>
  <button data-test="fetch-button" @click="downloadBeers">
    Click to fetch beer data
  </button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import { Beer } from '@/store/store-typings';

@Options({
  methods: {
    ...mapActions(['fetchBeers']),
  },
  computed: {
    ...mapGetters(['getBeers']),
  },
})
export default class BeerTable extends Vue {
  fetchBeers!: () => void;
  getBeers!: Beer[];

  get beers(): Beer[] {
    return this.getBeers;
  }

  async downloadBeers(): Promise<void> {
    await this.fetchBeers();
  }
}
</script>

<!-- <style scoped lang="scss">
</style> -->
