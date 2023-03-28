<script setup>
defineProps({
  isLoading: Boolean
});
</script>

<template>
  <div id="product-load-more" class="w-100">
    <div v-if="isLoading" class="text-center mt-10 mb-16">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#product-load-more {
  height: 50px;
}
</style>
