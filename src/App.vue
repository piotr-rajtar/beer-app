<template>
  <BeerTable />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BeerTable from './components/BeerTable.vue';

@Options({
  components: {
    BeerTable,
  },
})
export default class App extends Vue {}
</script>

<!-- <style lang="scss">
</style> -->
