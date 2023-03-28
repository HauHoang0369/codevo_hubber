<script setup>
import { onMounted, ref } from 'vue'
import { clone, debounce } from 'lodash'
// icons
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// components
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Observer from '@/components/base/Observer/Observer.vue'
// services
import ProductService from '@/services/Product/ProductService'

const props = defineProps({
  selectedItems: Array,
})

const emit = defineEmits(['updateTag'])

const selectedOptions = ref([])

const searchQuery = ref('')
const isLoading = ref(false)
const dataList = ref([])
const dataInfo = ref({
  searchText: '',
  number: -1,
  totalPages: 0,
})

const onSelect = (item, selectAll = null) => {
  if (typeof selectAll === 'boolean') {
    // Select/Deselect all items
    if (selectAll) {
      // Select all
      selectedOptions.value = dataList.value
    } else {
      // De-select all
      selectedOptions.value = []
    }
  } else {
    if (tickedChecking(item)) {
      // Remove single item
      selectedOptions.value = selectedOptions.value.filter(
        (o) => o.id !== item.id
      )
    } else {
      // Add single item
      selectedOptions.value.push(item)
    }
  }

  emit('updateTag', selectedOptions.value)
}

defineExpose({
  onSelect,
})

onMounted(async () => {
  await searchData()
  selectedOptions.value = clone(props.selectedItems)
})

const searchData = async (name = '') => {
  if (isLoading.value) {
    return
  }
  if (
    dataInfo.value.number > 0 &&
    dataInfo.value?.searchText === name &&
    dataInfo.value.number + 1 >= dataInfo.value?.totalPages
  ) {
    // Last page
    return
  }
  isLoading.value = true
  const result = await new ProductService().getSizes(
    dataInfo.value?.searchText === name ? dataInfo.value.number + 1 : 0, // Reset page if query text changed,
    true
  )
  dataList.value = [...dataList.value, ...result]
  dataInfo.value = result
  dataInfo.value.searchText = name
  isLoading.value = false
}

const searchInput = debounce((event) => {
  searchQuery.value = event.target.value
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    dataInfo.value.number = 0
    dataInfo.value.totalPages = 0
    dataList.value = []
    searchData(searchQuery.value)
  }
}, 500)

const tickedChecking = (value) => {
  return selectedOptions.value.findIndex((v) => v.id === value.id) !== -1
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row align-center position-relative">
      <input
        :value="searchQuery"
        class="search-input pl-4 w-100 pr-10"
        :placeholder="$t('PRODUCT_SEARCH_SIZE_CAPTION')"
        type="text"
        @keyup="searchInput"
      />
      <img
        :src="SearchIcon"
        alt="Search"
        class="search-icon position-absolute d-flex justify-end mr-4"
      />
    </div>

    <div class="extend-items flex-grow-1">
      <div
        v-for="item in dataList"
        :key="item.id"
        class="w-100 d-flex flex-row align-center justify-space-between content"
        @click.prevent="onSelect(item)"
      >
        <div class="d-flex align-center">
          <div class="icon">
            <AuthImage :height="70" :path="item.imageUrl" :width="70" />
          </div>
          <div class="info">
            <div class="item-name">{{ item.description }}</div>
          </div>
        </div>
        <div v-if="tickedChecking(item)" class="tick-icon rounded-circle">
          <img :src="CheckIcon" alt="Check" class="fill-height" />
        </div>
      </div>
      <div
        v-if="isLoading"
        class="d-flex spinning justify-center align-center pt-3"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </div>
      <Observer @intersect="searchData(searchQuery)" />
    </div>
    <div class="popup-shadow-box"></div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  cursor: pointer;
  position: relative;
  padding: 10px 0;
  min-height: 60px;

  .info {
    align-items: center;
    margin-left: 12px;

    .item-name {
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
    }

    .item-sub {
      font-size: 14px;
      color: var(--grey-dark);
    }
  }
}

.cursor-default {
  cursor: default;
}

.list-dropdowns {
  position: relative;
}

.popup-shadow-box {
  position: absolute;
  bottom: 0;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--white) 82%
  );
}

.extend-items {
  margin: 27px 26px 8px 15px;
  padding: 0 20px;
  max-height: 290px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7.5px;
    background-color: var(--grey);
  }

  .icon {
    width: 30px;
    height: 30px;
  }
}

.search-input {
  height: 55px;
  background-color: var(--background-blue);
  border-radius: 17px;

  &:focus-visible,
  &:focus {
    outline: none;
  }

  &::-webkit-input-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &:-moz-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &::-moz-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }

  &:-ms-input-placeholder {
    font-style: italic;
    color: var(--grey-dark);
  }
}

.tick-icon {
  height: 23px;
  width: 23px;
  background-image: linear-gradient(to bottom, #009982, var(--primary));
}

.search-icon {
  height: 20px;
  width: 20px;
  z-index: 100;
  right: 0;
}
</style>
