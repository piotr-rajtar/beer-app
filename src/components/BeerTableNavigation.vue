<template>
  <fieldset :class="style.navTypeContainer">
    <legend>Choose navigation type</legend>
    <span v-for="navigationItem in navigationItems" :class="style.navType" :key="navigationItem.id">
      <input
        v-model="activeDataLoader"
        :id="navigationItem.id"
        :data-test-id="navigationItem.id"
        :value="navigationItem.value"
        type="radio"
        @change="onChange"
      />
      <label :for="navigationItem.id">{{ navigationItem.label }}</label>
    </span>
  </fieldset>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DataLoaderType, NavigationItem } from '@/types/typings';

@Options({
  emits: ['change'],
})
export default class BeerTableNavigation extends Vue {
  activeDataLoader: DataLoaderType = DataLoaderType.LOAD_MORE;

  onChange(): void {
    this.$emit('change', this.activeDataLoader);
  }

  get navigationItems(): Array<NavigationItem> {
    return [
      {
        id: 'loadMore',
        value: DataLoaderType.LOAD_MORE,
        label: 'Load more',
      },
      {
        id: 'pagination',
        value: DataLoaderType.PAGINATION,
        label: 'Pagination',
      },
      {
        id: 'infiniteScroll',
        value: DataLoaderType.INFINITE_SCROLL,
        label: 'Infinite Scroll',
      },
    ];
  }
}
</script>

<style scoped lang="scss" module="style">
.navTypeContainer {
  margin: 0 0 20px 0;
  padding: 0;
  border: 0;
}

.navType {
  margin-right: 10px;
}
</style>
