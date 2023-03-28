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
import SocialWallService from '@/services/SocialWall/SocialWallService'

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
  const result = await new SocialWallService().getUsers(
    name,
    dataInfo.value?.searchText === name ? dataInfo.value.number + 1 : 0, // Reset page if query text changed,
    true
  )
  dataList.value = [...dataList.value, ...result.content]
  delete result.content
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
        placeholder="Seleziona utenti"
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
            <AuthImage :path="item.imageUrl" />
          </div>
          <div class="info">
            <div class="item-name">{{ item.shownName }}</div>
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
  }
}

.cursor-default {
  cursor: default;
}

.popup-shadow-box {
  position: relative;
  top: -50px;
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--white) 82%
  );
}

.extend-items {
  margin-top: 19px;
  max-height: 250px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  margin-bottom: 10px;
  cursor: pointer;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 7.5px;
    background-color: var(--grey);
  }

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    img {
      border-radius: 10px;
    }
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
