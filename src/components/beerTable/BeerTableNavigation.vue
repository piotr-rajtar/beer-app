<template>
  <fieldset :class="style.navTypeContainer">
    <legend>Choose navigation type</legend>
    <span :class="style.navType">
      <input v-model="loadingType" id="loadMore" type="radio" value="LoadMore" @change="onChange" />
      <label for="loadMore">Load more</label>
    </span>
    <span>
      <input v-model="loadingType" id="pagination" type="radio" value="Pagination" @change="onChange" />
      <label for="pagination">Pagination</label>
    </span>
  </fieldset>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { LoadingType } from '@/types/typings';

@Options({
  emits: ['change'],
})
export default class BeerTableNavigation extends Vue {
  loadingType: LoadingType = 'LoadMore';

  onChange(): void {
    this.$emit('change', this.loadingType);
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
