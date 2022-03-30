<template>
  <nav>
    <beer-button :is-disabled="isPrevButtonDisabled" @click="onPrevClick">
      Prev
    </beer-button>
    <beer-button :is-disabled="isNextButtonDisabled" @click="onNextClick">
      Next
    </beer-button>
  </nav>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import BeerButton from '@/components/shared/BeerButton.vue';

class Props {
  isPrevButtonDisabled = prop({
    type: Boolean,
  });
  isNextButtonDisabled = prop({
    type: Boolean,
  });
}

@Options({ components: { BeerButton }, emits: ['prevPage', 'nextPage'] })
export default class Pagination extends Vue.with(Props) {
  onPrevClick(): void {
    this.$emit('prevPage');
  }
  onNextClick(): void {
    this.$emit('nextPage');
  }
}
</script>

<style scoped lang="scss" module="style"></style>
