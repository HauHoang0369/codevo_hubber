<template>
  <base-card class="solution-card">
    <p class="solution-name font-weight-bold mb-4">
      {{ solution.name }}
    </p>
    <p class="solution-need-label mb-2">{{ $t('SOLUTION_NEED_CAPTION') }}</p>
    <p class="solution-need mb-7">
      {{ solution.need }}
    </p>
    <p class="mb-3">{{ $t('VALAGRO_EXPERIENCE_RELATED_SOLUTIONS_TITLE') }}</p>

    <div class="related-solutions">
      <auth-image
        v-for="item in solution.relatedSolutions"
        :key="item.id"
        :path="item.imageUrl"
      />
    </div>
  </base-card>
</template>

<script setup>
import BaseCard from '@/components/base/BaseCard.vue'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'

defineProps({
  solution: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss">
.solution-card {
  > * {
    color: var(--text);
  }

  .solution-name {
    font-size: 18px;
  }

  .solution-need {
    font-size: 20px;
    color: var(--primary-dark);
  }

  .related-solutions {
    display: flex;
    gap: 16px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
