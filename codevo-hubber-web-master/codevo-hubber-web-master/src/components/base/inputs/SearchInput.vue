<script setup>
import SearchIcon from '@/components/base/icons/SearchIcon.vue'

const emit = defineEmits('updated');

defineProps({
  placeholder: String,
  value: String,
});

const handleChange = (e) => {
  emit('updated', e.target.value);
};

</script>

<template>
  <div class="search-input-container">
    <input class="custom-input" :placeholder="placeholder" v-bind="value" v-on:input="handleChange"  />
    <span class="search-icon">
      <SearchIcon />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.search-input-container {
  height: 48px;
  background: white;
  border-radius: 18px;
  padding: 15px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  .custom-input {
    width: 100%;
    font-style: italic;
    font-size: 14px;
    color: $color-text;
    outline: none;
    padding: 0 40px 0 0;
    border-radius: 0;
    border: none;
  }

  .search-icon {
    position: absolute;
    right: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
