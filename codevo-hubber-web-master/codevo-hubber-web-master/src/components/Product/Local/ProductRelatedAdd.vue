<template>
  <div class="product-related-add">
    <base-icon
      class="product-related-add-icon"
      name="plus"
      :height="70"
      :width="70"
      color="#00604b"
    />
  </div>
</template>

<script setup>
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
</script>

<style lang="scss">
.product-related-add {
  display: flex;
  border: 2px dashed var(--primary);
  border-radius: 30px;
  cursor: pointer;
  justify-content: center;
  &-icon {
    margin: 175px auto;
  }
}
</style>
