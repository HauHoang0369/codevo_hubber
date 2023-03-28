<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'

const props = defineProps({
  solution: Object,
})
</script>

<template>
  <div class="related-solution-card">
    <div class="related-solution-card-image">
      <auth-image
        :path="solution.knowledgeLevel.imageUrl"
        :width="124"
        :height="121"
      />
    </div>

    <div class="related-solution-card-content">
      <p
        class="related-solution-card-content-title"
        v-text="solution.crop.name"
      />
      <p
        class="related-solution-card-content-text"
        v-text="solution.crop.needShortDescription"
      />
    </div>
  </div>
</template>

<style type="text/css" scoped>
.related-solution-card {
  display: flex;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.related-solution-card-image {
  border-radius: 20px 60px 60px 20px;
  width: 124px;
  height: 121px;
  overflow: hidden;
}

.related-solution-card-content {
  margin-left: 21px;
}

.related-solution-card-content-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text);
}

.related-solution-card-content-text {
  font-size: 14px;
  font-weight: 300;
  color: var(--text);
  margin-top: 15px;
}

@media (max-width: 480px) {
  .related-solution-card-content-title {
    font-size: 16px;
  }
  .related-solution-card-content {
    font-size: 20px;
  }
  .related-solution-card-image {
    min-width: 90px;
    max-width: 90px;
    height: 80px;
  }
}
</style>
