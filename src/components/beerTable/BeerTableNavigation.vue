<template>
  <fieldset :class="style.navTypeContainer">
    <legend>Choose navigation type</legend>
    <span :class="style.navType">
      <input
        id="loadMore"
        v-model="navigationType"
        :value="LoadingComponent.LOAD_MORE"
        type="radio"
        @change="onChange"
      />
      <label for="loadMore">Load more</label>
    </span>
    <span>
      <input
        id="pagination"
        v-model="navigationType"
        :value="LoadingComponent.PAGINATION"
        type="radio"
        @change="onChange"
      />
      <label for="pagination">Pagination</label>
    </span>
    <span>
      <input
        id="infiniteScroll"
        v-model="navigationType"
        :value="LoadingComponent.INFINITE_SCROLL"
        type="radio"
        @change="onChange"
      />
      <label for="infiniteScroll">Infinite Scroll</label>
    </span>
  </fieldset>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { LoadingComponent } from '@/types/typings';

@Options({
  emits: ['change'],
})
export default class BeerTableNavigation extends Vue {
  LoadingComponent = LoadingComponent;
  navigationType: LoadingComponent = LoadingComponent.LOAD_MORE;

  onChange(): void {
    this.$emit('change', this.navigationType);
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
