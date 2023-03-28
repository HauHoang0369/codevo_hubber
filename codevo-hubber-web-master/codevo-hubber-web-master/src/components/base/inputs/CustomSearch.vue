<script setup>
import { ref, watch } from 'vue'
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
// import {computed, onMounted, reactive, ref} from 'vue'
const props = defineProps({
  placeholder: String,
  bgColor: String,
})

const emit = defineEmits(['onSearch'])

const searchQuery = ref('')
watch(
  () => searchQuery.value,
  // eslint-disable-next-line no-unused-vars
  (newValue, oldValue) => {
    if (newValue.length >= 3) {
      onSearch(searchQuery.value)
    }
  }
)

const onSearch = (value) => {
  console.log('onSearch: ' + value)
  emit('onSearch', value)
}
</script>

<template>
  <div class="w-100">
    <!--    <input type="text" :placeholder="placeholder" class="search-input w-100" :value="value"/>-->
    <div class="d-flex flex-row align-center position-relative">
      <div class="text-lg-h6 flex-grow-1 h-100 text-left" style="z-index: 99">
        <input
          type="text"
          :placeholder="placeholder"
          class="search-input pl-4 w-100 pr-10"
          :style="{ 'background-color': bgColor }"
          v-model="searchQuery"
        />
      </div>
      <img
        :src="SearchIcon"
        class="search-icon position-absolute d-flex justify-end mr-4"
        style="z-index: 100"
      />
    </div>
  </div>
</template>

<style scoped>
.search-input {
  padding: 14px 17px 14.9px 15px;
  border-radius: 18px;
  background-color: white;
  height: 50px;
}

.search-icon {
  height: 20px;
  width: 20px;
  z-index: 100;
  /*cursor: pointer;*/
  right: 0;
}

.search-input::placeholder {
  opacity: 0.5;
  font-family: Ubuntu;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.search-input:focus {
  border: none;
  outline: none;
}
</style>
