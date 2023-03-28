<script setup>
defineProps({
  categories: Array,
  selectedCategoryId: {
    type: Number,
    default: -1,
  },
})

const emit = defineEmits(['selectCategory'])

const selectCategory = (categoryId) => {
  emit('selectCategory', categoryId)
}
</script>

<template>
  <div class="top-menu">
    <div
      v-for="category in categories"
      :key="category.value"
      :class="{ active: selectedCategoryId === category.value }"
      class="top-menu-item"
      @click="selectCategory(category.value)"
    >
      {{ category.name }}
    </div>
  </div>
</template>

<style>
.top-menu {
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: end;
}

.top-menu-item {
  margin: 0 5px;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 0.6em;
  font-weight: bolder;
  color: var(--primary);
  cursor: pointer;
}

.top-menu-item.active {
  background-color: var(--primary-70);
  color: var(--white);
}

@media all and (max-width: 480px) {
  .top-menu {
    flex-wrap: wrap;
  }

  .top-menu .top-menu-item {
    width: 100%;
  }
}

@media (min-width: 1400px) {
  .top-menu-item {
    font-size: 1em;
  }
}
</style>
