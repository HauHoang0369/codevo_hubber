<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { clone, debounce } from 'lodash'
// icons
import SearchIcon from '@/assets/icons/icon-system-search@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// components
import AuthImage from '@/components/base/AuthImage/AuthImage'
import Observer from '@/components/base/Observer/Observer.vue'
// services
import ProductService from '@/services/Product/ProductService'
import { useStore } from 'vuex'

const props = defineProps({
  selectedItems: Array,
  productFamilies: Number,
  multiSelect: {
    type: Boolean,
    default: false,
  },
  isGlobal: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['updateTag', 'product-family-select'])
const store = useStore()

const user = computed(() => store.getters.getUser)
const selectedOptions = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const dataList = ref([])
const dataInfo = ref({
  searchText: '',
  number: -1,
  totalPages: 0,
})

const params = ref({
  marketId: user.value.market.id,
  excludedMarket: user.value.market.id,
  contentLanguage: user.value.contentLanguage.isoCode,
  activeOnly: true,
  pageable: {
    page: 0,
    size: 10,
  },
})

const onSelect = (item) => {
  if (props.multiSelect) {
    const index = selectedOptions.value.findIndex((v) => v.id === item.id)
    if (index > -1) {
      selectedOptions.value.splice(index, 1)
    } else {
      selectedOptions.value.push(item)
    }
  } else {
    selectedOptions.value = tickedChecking(item) ? [] : [item]
  }
  emit('updateTag', selectedOptions.value)
}

onMounted(async () => {
  if (props.productFamilies) {
    params.value.productFamilies = props.productFamilies
  }
  await searchData()
  selectedOptions.value = clone(props.selectedItems)
})

watch(
  () => props.productFamilies,
  async (value) => {
    if (value) {
      params.value.productFamilies = value
    }

    dataInfo.value = {
      searchText: '',
      number: -1,
      totalPages: 0,
    }
    dataList.value = []

    await searchData()
    selectedOptions.value = clone(props.selectedItems)
  }
)

const searchProducts = async (name = '') => {
  if (
    dataInfo.value.number > 0 &&
    dataInfo.value?.searchText === name &&
    dataInfo.value.number + 1 >= dataInfo.value?.totalPages
  ) {
    // Last page
    return
  }
  isLoading.value = true

  params.value.pageable.page =
    dataInfo.value?.searchText === name ? dataInfo.value.number + 1 : 0 // Reset page if query text changed,

  const result = await new ProductService().searchGlobalProducts({
    contentLanguage: user.value.contentLanguage.isoCode,
    name,
    page: params.value.pageable.page,
  })
  dataList.value = [...dataList.value, ...result.content]
  delete result.content
  dataInfo.value = result
  dataInfo.value.searchText = name
  isLoading.value = false
}

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

  params.value.pageable.page =
    dataInfo.value?.searchText === name ? dataInfo.value.number + 1 : 0 // Reset page if query text changed,
  const result = props.isGlobal
    ? await new ProductService().service.getGlobalProducts(params.value)
    : await new ProductService().service.getProducts(params.value)
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
    searchProducts(searchQuery.value)
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
        placeholder="Cerca un prodotto"
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
            <AuthImage
              v-if="item.imageUrl"
              :height="169"
              :path="item.imageUrl"
              :width="128"
            />
            <img
              v-else
              alt="Product Image"
              src="/images/img-product-actiwave.png"
            />
          </div>
          <div class="info">
            <div
              v-if="item.productFamily?.id"
              :style="{ backgroundColor: item.productFamily.color }"
              class="item-code"
            >
              {{ item.productFamily.code }}
            </div>
            <div class="item-name">{{ item.name }}</div>
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
  min-height: 75px;
  border-bottom: 1px solid var(--grey);

  .info {
    align-items: center;
    margin-left: 12px;

    .item-name {
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
      min-height: 22px;
      margin-top: 6px;
    }

    .item-code {
      display: inline;
      padding: 2px 5px;
      border-radius: 13.5px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      color: var(--white);
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
    display: flex;
    align-items: center;
    width: 46px;
    height: 65px;

    img {
      width: 100%;
      height: 100%;
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
