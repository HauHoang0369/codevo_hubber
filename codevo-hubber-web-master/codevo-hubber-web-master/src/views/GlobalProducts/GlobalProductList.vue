<script setup>
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import ProductService from '@/services/Product/ProductService'
import ProductCard from '@/components/ProductCard/ProductCard'
import Grid from '@/components/base/Grid/Grid'

import Chip from '@/components/base/buttons/Chip'

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import FilterCard from '@/components/Filtering/FilterCard'
import ProductLoader from "@/components/Product/ProductLoader";

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.getUser)

const isLoading = ref(false)
const productFamilies = ref([])
const crops = ref([])
const cropsPageable = ref({
  page: 0,
  size: 100,
  sort: 'asc',
})

const applicationModalities = ref([])
const applicationModalitiesPageable = ref({
  page: 0,
  size: 100,
  sort: 'asc',
})

let productsPageable = ref({
  page: 0,
  size: 9,
  sort: 'asc',
})
// Stores full api response, including pagedata
const productsEnvelope = ref({})
// Stores only response content, actual data
const products = ref([])

const showFilterCard = ref(false)
let selectedFilters = ref({})
const filters = ref({
  switches: [
    {
      key: 'preferiti',
      label: 'Mostra solo i preferiti',
      value: false,
    },
    {
      key: 'novita',
      label: 'Mostra solo le novità',
      value: false,
    },
  ],
  chips: [
    {
      key: 'prodotti',
      label: 'Filtra per categoria di prodotto:',
      values: [],
    },
    {
      key: 'coltura',
      label: 'Filtra per coltura:',
      values: [],
    },
    {
      key: 'applicazione',
      label: 'Filtra per applicazione:',
      values: [],
    },
  ],
})

const getFilterIndexByKey = (filterType, filterKey) => {
  if (filterType in filters.value) {
    return Object.entries(filters.value[filterType])?.findIndex(
      (filterItem, index) => {
        return filters.value[filterType][index].key === filterKey
      }
    )
  }
  return -1
}

const getFilterGroupByKey = (filterType, filterKey) => {
  if (filterType in filters.value) {
    return filters.value[filterType]?.find((filterGroup, index) => {
      return filterGroup?.key === filterKey
    })
  }
  return null
}

const prepareSelectedFilters = async () => {
  // prepare selectedFilters keys
  // Filters are stored in a single array
  // First create a map with filter keys
  // Then merge with selected prop values
  let combined = [...filters.value?.chips, ...filters.value?.switches]
  for (const [key, value] of Object.entries(combined)) {
    let objectKey = value?.key
    if (objectKey) {
      // selectedFilters[objectKey] = []
      if ('value' in value) {
        // TODO: if value is not a boolean?
        selectedFilters.value[objectKey] = ref(false)
      } else if ('values' in value) {
        selectedFilters.value[objectKey] = []
      }
    }
  }
}

onMounted(async () => {
  try {
    store.commit('setLoading', true)
    let productFamiliesData =
      await new ProductService().service.getProductFamilies(
        user.value.market.id,
        true,
        true,
        user.value.contentLanguage.isoCode,
        productsPageable.value,
        true,
        true
      )
    productFamilies.value = productFamiliesData.content
    // Set filter options for productfamilies
    let filterProductsIndex = getFilterIndexByKey('chips', 'prodotti')
    if (filterProductsIndex >= 0) {
      for (const product of productFamiliesData?.content) {
        filters.value.chips[filterProductsIndex]?.values.push({
          title: product?.name ?? '',
          value: product?.id ?? -1,
          bgColor: product?.color,
        })
      }
    }

    // Set filter options for crops
    let cropsData = await new ProductService().service.getCrops(
      user.value.contentLanguage.isoCode,
      cropsPageable.value
    )
    crops.value = cropsData.content
    // Find object for crops in filters
    let filterCropsIndex = getFilterIndexByKey('chips', 'coltura')
    if (filterCropsIndex >= 0) {
      for (const crop of cropsData?.content) {
        filters.value.chips[filterCropsIndex]?.values.push({
          title: crop?.description ?? '',
          value: crop?.id ?? -1,
        })
      }
    }

    let applicationModalitiesData =
      await new ProductService().service.getApplicationModalities(
        user.value.contentLanguage.isoCode,
        applicationModalitiesPageable.value
      )
    applicationModalities.value = applicationModalitiesData.content

    let filterApplicationModalitiesIndex = getFilterIndexByKey(
      'chips',
      'applicazione'
    )
    if (filterApplicationModalitiesIndex >= 0) {
      for (const application of applicationModalitiesData?.content) {
        filters.value.chips[filterApplicationModalitiesIndex]?.values.push({
          title: application?.description ?? '',
          value: application?.id ?? -1,
        })
      }
    }
    // To make computed refresh
    filters.value = { ...filters.value }
    await prepareSelectedFilters()
    await loadProducts(true, true)
    store.commit('setLoading', false)
    // Add scroll listener only if there are products loaded and more than one page
    if (
      productsEnvelope.value?.first === true &&
      productsEnvelope.value?.last === false
    ) {
      window.addEventListener('scroll', onHandleProductsGridScroll)
    }
  } catch (e) {
    store.commit('setLoading', false)
    console.error(e)
  }
})

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleProductsGridScroll)
})

const onHandleProductsGridScroll = async (e) => {
  // Only load new items if our indicator is in display and we are not on the last page
  if (isLoadMoreInScreen() && productsEnvelope.value?.last === false) {
    // remove scroll listener while loading new products
    try {
      isLoading.value = true
      window.removeEventListener('scroll', onHandleProductsGridScroll)
      await onMoreProducts()
    } catch (e) {
    } finally {
      isLoading.value = false
      window.addEventListener('scroll', onHandleProductsGridScroll)
    }
  }
}

const isLoadMoreInScreen = () => {
  let productsLoadMoreItem = document.querySelector('#product-load-more')
  // Check if our 0 height indicator item is in display,
  let pageTop = window.scrollY
  let pageBottom = pageTop + window.innerHeight
  let elementTop = productsLoadMoreItem.offsetTop
  let elementBottom = elementTop + productsLoadMoreItem.clientHeight
  return elementTop <= pageBottom
}

const loadProducts = async (initialLoad, hideLoader) => {
  try {
    window.removeEventListener('scroll', onHandleProductsGridScroll)
    if (initialLoad) {
      products.value.splice(0, products.value.length)
    }

    let productParameters = {
      marketId: user.value.market.id,
      contentLanguage: user.value.contentLanguage.isoCode,
      pageable: productsPageable.value,
      hideLoader: hideLoader,
    }
    // If no filter is selected
    if (checkSelectedFiltersEmpty() === false) {
      if ('prodotti' in selectedFilters.value) {
        let values = selectedFilters.value['prodotti']?.map(
          (product) => product.value
        )
        if (values?.length > 0) {
          Object.assign(productParameters, { productFamilies: values })
        }
      }
      if ('coltura' in selectedFilters.value) {
        let values = selectedFilters.value['coltura']?.map((crop) => crop.value)
        if (values?.length > 0) {
          Object.assign(productParameters, { crops: values })
        }
      }
      if ('applicazione' in selectedFilters.value) {
        let values = selectedFilters.value['applicazione']?.map(
          (application) => application.value
        )
        if (values?.length > 0) {
          Object.assign(productParameters, { applicationModalities: values })
        }
      }
      if ('preferiti' in selectedFilters.value) {
        Object.assign(productParameters, {
          onlyFavourites: selectedFilters.value['preferiti'],
        })
      }
      if ('novita' in selectedFilters.value) {
        Object.assign(productParameters, {
          onlyNew: selectedFilters.value['novita'],
        })
      }
    }
    productsEnvelope.value =
      await new ProductService().service.getGlobalProducts(productParameters)
    if (productsEnvelope.value.content) {
      products.value.push(...productsEnvelope.value.content)
    }
    window.addEventListener('scroll', onHandleProductsGridScroll)
  } catch (e) {
    window.addEventListener('scroll', onHandleProductsGridScroll)
    console.error(e)
  }
}

const onMoreProducts = async () => {
  productsPageable.value.page += 1
  await loadProducts(false)
}

const onSelectProductFamily = async (categoryId) => {
  if ('prodotti' in selectedFilters.value) {
    if (categoryId === -1) {
      selectedFilters.value['prodotti'] = []
    } else {
      // find filter chips prodotti with value categoryId
      let productFamilyFilters = getFilterGroupByKey('chips', 'prodotti')
      if (productFamilyFilters) {
        let productFamilyFilterItem = productFamilyFilters?.values?.find(
          (filterItem, index) => {
            return filterItem?.value === categoryId
          }
        )
        selectedFilters.value['prodotti'] = [productFamilyFilterItem]
      }
    }
  }
  productsPageable.value = {
    page: 0,
    size: 9,
    sort: 'asc',
  }
  try {
    store.commit('setLoading', true)
    await loadProducts(true, true)
    store.commit('setLoading', false)
  } catch (e) {
    store.commit('setLoading', false)
  }
}

const productFamiliesAll = computed({
  get() {
    const allItems = {
      name: 'Tutte',
      value: -1,
    }
    let productFamilies = [allItems]
    let productFamiliesFilters = getFilterGroupByKey('chips', 'prodotti')
    for (const productFamily of productFamiliesFilters?.values) {
      productFamilies.push({
        name: productFamily?.title,
        value: productFamily?.value,
      })
    }
    return productFamilies
  },
})

const onToggleFilterCard = async () => {
  showFilterCard.value = !showFilterCard.value
}
const onConfirmFilters = async (selectedFiltersData) => {
  console.log('Confirm filters')
  selectedFilters.value = { ...selectedFiltersData }
  console.log(selectedFilters.value)
  showFilterCard.value = false
  // check if only product family has only single selected value
  if (isSingleProductFamilySelected()) {
    let [productFamilyId] = selectedFilters.value['prodotti']
    await onSelectProductFamily(productFamilyId?.value)
  } else {
    if (checkSelectedFiltersEmpty() === true) {
      // load filtered products
      await onSelectProductFamily(-1)
    }
    // if selected filters are not empty send query to load products
    else {
      // load product list by filters
      try {
        // TODO: Move to separate initial load products method
        productsPageable.value = {
          page: 0,
          size: 9,
          sort: 'asc',
        }
        store.commit('setLoading', true)
        await loadProducts(true, true)
        store.commit('setLoading', false)
      } catch (e) {
        store.commit('setLoading', false)
        console.error(e)
      }
    }
  }
}

const isSingleProductFamilySelected = () => {
  let filterGroupCounts = selectedFilterGroupCounts()
  let productFamilies = 0
  let otherFilters = 0
  for (const [key, value] of Object.entries(filterGroupCounts)) {
    if (value > 0) {
      if (key === 'prodotti') {
        productFamilies = value
      } else {
        otherFilters = value
      }
    }
  }
  return productFamilies === 1 && otherFilters === 0
}
const selectedFilterGroupCounts = () => {
  let filterGroupCounts = {}
  for (const [key, value] of Object.entries(selectedFilters.value)) {
    if (Array.isArray(value)) {
      filterGroupCounts[key] = value.length
    }
  }
  return filterGroupCounts
}

const isSelectedFiltersEmpty = computed({
  get() {
    return checkSelectedFiltersEmpty() || isSingleProductFamilySelected()
  },
})

const checkSelectedFiltersEmpty = () => {
  let isEmpty = true
  for (const [key, value] of Object.entries(selectedFilters.value)) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        isEmpty = isEmpty && false
      }
    } else if (typeof value === 'boolean') {
      if (value === true) {
        isEmpty = isEmpty && false
      }
    }
  }
  return isEmpty
}

// return only filters with chips, not switches
const selectedFiltersChips = computed({
  get() {
    return Object.fromEntries(
      Object.entries(selectedFilters.value).filter(([key, value]) =>
        Array.isArray(value)
      )
    )
  },
})

const unselectFilter = async (key, filter) => {
  let filterGroup = selectedFilters.value[key]
  if (filterGroup) {
    let filterIndex = Object.entries(filterGroup)?.findIndex(
      (filterItem, index) => {
        return filter?.value === filterGroup[index]?.value
      }
    )
    if (filterIndex !== -1) {
      filterGroup?.splice(filterIndex, 1)
    }
  }
  // if selected filters are empty make tabbar selected as all and load products
  if (checkSelectedFiltersEmpty() === true) {
    // Load all products
    await onSelectProductFamily(-1)
  } else {
    try {
      productsPageable.value = {
        page: 0,
        size: 9,
        sort: 'asc',
      }
      store.commit('setLoading', true)
      await loadProducts(true, true)
      store.commit('setLoading', false)
    } catch (e) {
      store.commit('setLoading', false)
      console.error(e)
    }
  }
}

const selectedProductFamilyId = computed({
  get() {
    if ('prodotti' in selectedFilters.value) {
      if (selectedFilters.value['prodotti'].length === 1) {
        return selectedFilters.value['prodotti'][0]?.value
      }
    }
    return -1
  },
})

const numberOfProductsShown = computed({
  get() {
    return products.value?.length
  },
})

const totalNumberOfProductsShown = computed({
  get() {
    console.log(
      'totalNumberOfProductsShown: ' + productsEnvelope?.value?.totalElements
    )
    return productsEnvelope?.value?.totalElements
  },
})
</script>

<template>
  <div>
    <TopMenu
      :categories="productFamiliesAll"
      :selected-category-id="selectedProductFamilyId"
      @select-category="onSelectProductFamily"
      v-if="isSelectedFiltersEmpty"
    ></TopMenu>
    <TopFilters
      :value="numberOfProductsShown"
      :total="totalNumberOfProductsShown"
      type="prodotti"
      :filters="filters"
      v-on:toggle="onToggleFilterCard"
    />
    <div
      class="selected-filters d-flex justify-end flex-wrap"
      v-if="!isSelectedFiltersEmpty"
    >
      <div
        v-for="(item, objectKey) in selectedFiltersChips"
        :key="objectKey"
        class="d-flex flex-wrap justify-end"
      >
        <Chip
          v-for="(chip, chipIndex) in item"
          :key="chipIndex"
          :clickable="true"
          :selected="true"
          class="ml-2"
          :class="[
            item?.bgColor !== undefined ? 'text-white' : 'filter-chip-selected',
          ]"
          :style="{
            backgroundColor: chip?.bgColor + '!important' ?? 'inherit',
          }"
          v-on:click="unselectFilter(objectKey, chip)"
        >
          {{ chip?.title }}
        </Chip>
      </div>
    </div>
    <div class="filters-card-container mt-6" v-if="showFilterCard">
      <FilterCard
        v-on:close="onToggleFilterCard"
        v-on:confirm="onConfirmFilters"
        title="Filtra per"
        :filters="filters"
        :selected="selectedFilters"
      >
      </FilterCard>
    </div>
    <div class="content">
      <Grid xl="3" lg="2" md="2" sm="1" :column-gap="30" :row-gap="30"
            class="">
        <ProductCard
          v-for="productData in products"
          :product="productData"
          :is-anonymous="user?.id === null"
          :key="productData.id"
          :is-global="true"
        />
      </Grid>

      <ProductLoader :is-loading="isLoading" />
    </div>
  </div>
</template>
<style scoped>
.content {
  height: 100%;
  flex-grow: 1;
}

.selected-filters {
  margin-top: 30px;
}

</style>
