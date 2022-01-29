<template>
  <beer-table-view />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BeerTableView from './views/BeerTableView.vue';

@Options({
  components: {
    BeerTableView,
  },
})
export default class App extends Vue {}
</script>

<!-- <style lang="scss">
</style> -->
