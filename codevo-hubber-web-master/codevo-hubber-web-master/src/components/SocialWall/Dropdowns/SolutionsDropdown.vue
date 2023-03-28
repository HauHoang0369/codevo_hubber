<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { clone, debounce } from 'lodash'
// icons
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
import IconSolution from '@/assets/icons/icon-system-solutions@2x.png'
// services
import ProductService from '@/services/Product/ProductService'
import Observer from '@/components/base/Observer/Observer.vue'

const props = defineProps({
  selectedItems: Array,
})

const store = useStore()
const emit = defineEmits(['updateTag'])

const user = computed(() => store.getters.getUser)
const selectedOptions = ref([])

const searchQuery = ref('')
const isLoading = ref(false)
const dataList = ref([])
const dataSolution = ref({
  searchText: '',
  number: -1,
  totalPages: 0,
})

const onSelect = (item) => {
  if (tickedChecking(item)) {
    // Remove tag
    emit('updateTag', item)
    selectedOptions.value = selectedOptions.value.filter(
      (o) => o.id !== item.id
    )
  } else {
    // Add tag
    emit(
      'updateTag',
      {
        id: item.id,
        category: 'SOLUTION',
        name: item.name,
      },
      false
    )
    selectedOptions.value.push({
      id: item.id,
      category: 'SOLUTION',
      name: item.name,
    })
  }
}
onMounted(async () => {
  await searchSolutions()
  selectedOptions.value = clone(props.selectedItems)
})

const searchSolutions = async (name = '') => {
  if (isLoading.value) {
    return
  }

  if (dataSolution.value?.last) {
    // Last page
    return
  }

  isLoading.value = true
  const result = await new ProductService().service.callSearchedSolutions(
    user.value.getOldAccessToken,
    user.value.contentLanguage.isoCode,
    user.value.market.id,
    name,
    dataSolution.value?.searchText === name ? dataSolution.value.number + 1 : 0, // Reset page if query text changed
    true
  )
  dataList.value = [...dataList.value, ...result.content]
  delete result.content
  dataSolution.value = result
  dataSolution.value.searchText = name
  isLoading.value = false
}

const searchInput = debounce((event) => {
  searchQuery.value = event.target.value
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    dataSolution.value.number = 0
    dataSolution.value.totalPages = 0
    dataList.value = []
    searchSolutions(searchQuery.value)
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
        placeholder="Cerca soluzione"
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
        class="d-flex flex-row align-center justify-space-between content"
        @click.prevent="onSelect(item)"
      >
        <div class="d-flex align-center">
          <div class="icon">
            <img :alt="item.name" :src="IconSolution" />
          </div>
          <div class="info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-sub">{{ item.need }}</div>
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
      <Observer @intersect="searchSolutions(searchQuery)" />
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
  border-bottom: solid 1px var(--grey);

  .info {
    align-items: center;
    margin-left: 12px;

    .item-name {
      font-size: 16px;
      font-weight: bold;
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
  max-height: 317px;
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
    width: 60px;
    height: 60px;
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
