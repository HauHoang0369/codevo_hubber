<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import ProductService from '@/services/Product/ProductService'
import ProductCard from '@/components/ProductCard/ProductCard'
import Grid from '@/components/base/Grid/Grid'
import Chip from '@/components/base/buttons/Chip'
import FilterCard from '@/components/Filtering/FilterCard'
import CompetitorProductActions from '@/components/Product/CompetitorProductActions'
import ProductLoader from '@/components/Product/ProductLoader'

const store = useStore()

const productClasses = ref([])
const productFamilies = ref([])
const productsPageable = ref({
  page: 0,
  size: 9,
  sort: 'asc',
})
// Stores full api response, including pagedata
const productsEnvelope = ref({})
// Stores only response content, actual data
const products = ref([])

const selectedClassId = ref(-1)
const showFilterCard = ref(false)
const selectedFilters = ref({})
const filters = ref({
  chips: [
    {
      key: 'approvazione',
      label: 'Filtra per stato di approvazione',
      values: [
        {
          title: 'Inviato',
          value: 'PENDING',
        },
        {
          title: 'Approvato',
          value: 'APPROVED',
        },
        {
          title: 'Respinto',
          value: 'REJECTED',
        },
      ],
    },
    {
      key: 'categoria',
      label: 'Filtra per categoria di prodotto',
      values: [],
    },
    {
      key: 'classe',
      label: 'Filtra per classe di prodotto',
      values: [],
    },
  ],
  selects: [
    {
      key: 'produttori',
      label: 'Produttori',
      values: [],
    },
  ],
})

const isLoading = ref(false)

const user = computed(() => store.getters.getUser)

const selectedFilterGroupCounts = computed(() => {
  let filterGroupCounts = {}
  for (const [key, value] of Object.entries(selectedFilters.value)) {
    if (Array.isArray(value)) {
      filterGroupCounts[key] = value.length
    }
  }
  return filterGroupCounts
})

const isSingleProductFamilySelected = computed(() => {
  let productFamilies = 0
  let otherFilters = 0
  for (const [key, value] of Object.entries({
    ...selectedFilterGroupCounts.value,
  })) {
    if (value > 0) {
      if (key === 'categoria') {
        productFamilies = value
      } else {
        otherFilters = value
      }
    }
  }
  return productFamilies === 1 && otherFilters === 0
})

const checkSelectedFiltersEmpty = computed(() => {
  let isEmpty = true
  for (const [, value] of Object.entries(selectedFilters.value)) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        isEmpty = false
      }
    } else if (typeof value === 'boolean') {
      if (value) {
        isEmpty = false
      }
    }
  }
  return isEmpty
})

const isSelectedFiltersEmpty = computed(
  () => checkSelectedFiltersEmpty.value || isSingleProductFamilySelected.value
)

const isLoadMoreInScreen = () => {
  const productsLoadMoreItem = document.querySelector('#product-load-more')
  // Check if our 0 height indicator item is in display,
  const pageTop = window.scrollY
  const pageBottom = pageTop + window.innerHeight
  const elementTop = productsLoadMoreItem.offsetTop

  return elementTop <= pageBottom
}

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

const prepareSelectedFilters = async () => {
  // prepare selectedFilters keys
  // Filters are stored in a single array
  // First create a map with filter keys
  // Then merge with selected prop values
  let combined = [
    ...(filters.value?.chips || []),
    ...(filters.value?.switches || []),
  ]
  for (const [, value] of Object.entries(combined)) {
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

const initialize = async () => {
  try {
    store.commit('setLoading', true)

    const productFamiliesData =
      await new ProductService().service.getProductFamilies(
        user.value.market.id,
        true,
        true,
        user.value.contentLanguage.isoCode,
        productsPageable.value,
        true,
        false
      )
    productFamilies.value = productFamiliesData.content
    // Set filter options for productfamilies
    let filterFamiliesIndex = getFilterIndexByKey('chips', 'categoria')
    if (filterFamiliesIndex >= 0) {
      for (const family of productFamiliesData?.content) {
        filters.value.chips[filterFamiliesIndex]?.values.push({
          title: family?.name ?? '',
          value: family?.id ?? -1,
          bgColor: family?.color,
        })
      }
    }

    // Set filter options for classes
    const productClassesData =
      await new ProductService().service.getProductClasses(
        user.value.market.id,
        user.value.contentLanguage.isoCode,
        user.value.id
      )
    productClasses.value = productClassesData

    // Find object for crops in filters
    let filterClassesIndex = getFilterIndexByKey('chips', 'classe')
    if (filterClassesIndex >= 0) {
      for (const item of productClassesData) {
        filters.value.chips[filterClassesIndex]?.values.push({
          title: item?.name ?? '',
          value: item?.id ?? -1,
        })
      }
    }

    // Set filter options for producers
    const producersData = await new ProductService().service.getProducers({
      contentLanguage: user.value.contentLanguage.isoCode,
    })

    // Find object for crops in filters
    let filterProducersIndex = getFilterIndexByKey('selects', 'produttori')
    if (filterProducersIndex >= 0) {
      for (const producer of producersData?.content) {
        filters.value.selects[filterProducersIndex]?.values.push({
          title: producer?.name ?? '',
          value: producer?.id ?? -1,
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
}

initialize()

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleProductsGridScroll)
})

const onHandleProductsGridScroll = async () => {
  // Only load new items if our indicator is in display and we are not on the last page
  if (isLoadMoreInScreen() && productsEnvelope.value?.last === false) {
    // remove scroll listener while loading new products
    try {
      isLoading.value = true
      window.removeEventListener('scroll', onHandleProductsGridScroll)
      await onMoreProducts()
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
      window.addEventListener('scroll', onHandleProductsGridScroll)
    }
  }
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
      ...(selectedClassId.value !== -1 && { classId: selectedClassId.value }),
      page: productsPageable.value,
      userId: user.value.id,
      hideLoader: hideLoader,
    }
    // If no filter is selected
    if (!checkSelectedFiltersEmpty.value) {
      if ('categoria' in selectedFilters.value) {
        let values = selectedFilters.value['categoria']?.map(
          (product) => product.value
        )
        if (values?.length > 0) {
          Object.assign(productParameters, { productFamilies: values })
        }
      }
      if ('approvazione' in selectedFilters.value) {
        let values = selectedFilters.value['approvazione']?.map(
          (status) => status.value
        )
        if (values?.length > 0) {
          Object.assign(productParameters, { statuses: values })
        }
      }
      if ('classe' in selectedFilters.value) {
        let values = selectedFilters.value['classe']?.map((item) => item.value)
        if (values?.length > 0) {
          Object.assign(productParameters, { classes: values })
        }
      }
    }
    productsEnvelope.value =
      await new ProductService().service.getCompetitorProducts(
        productParameters
      )
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

const onSelectProductClass = async (classId) => {
  selectedClassId.value = classId

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

const productClassesAll = computed(() => {
  const firstClassItem = {
    name: 'Tutte',
    value: -1,
  }

  return [firstClassItem].concat(
    productClasses.value.map(({ id, name }) => ({ name, value: id }))
  )
})

const onToggleFilterCard = async () => {
  showFilterCard.value = !showFilterCard.value
}
const onConfirmFilters = async (selectedFiltersData) => {
  selectedFilters.value = { ...selectedFiltersData }

  showFilterCard.value = false
  // check if only product family has only single selected value
  if (isSingleProductFamilySelected.value) {
    let [productFamilyId] = selectedFilters.value['categoria']
    await onSelectProductClass(productFamilyId?.value)
  } else {
    if (checkSelectedFiltersEmpty.value) {
      // load filtered products
      await onSelectProductClass(-1)
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

// return only filters with chips, not switches
const selectedFiltersChips = computed(() =>
  Object.fromEntries(
    Object.entries(selectedFilters.value).filter(([, value]) =>
      Array.isArray(value)
    )
  )
)

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
  if (checkSelectedFiltersEmpty.value) {
    // Load all products
    await onSelectProductClass(-1)
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

const numberOfProductsShown = computed(() => products.value?.length)

const totalNumberOfProductsShown = computed(
  () => productsEnvelope?.value?.totalElements
)
</script>

<template>
  <div>
    <TopMenu
      :categories="productClassesAll"
      :selected-category-id="selectedClassId"
      @select-category="onSelectProductClass"
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

    <div class="d-flex justify-end mt-8">
      <CompetitorProductActions />
    </div>

    <div class="content">
      <Grid xl="3" lg="2" md="2" sm="1" :column-gap="30" :row-gap="30">
        <ProductCard
          v-for="productData in products"
          :product="productData"
          :is-anonymous="user?.id === null"
          :key="productData.id"
        />
      </Grid>

      <ProductLoader :is-loading="isLoading" />
    </div>
  </div>
</template>
<style type="text/css" scoped>
.content {
  height: 100%;
  flex-grow: 1;
}

#products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  grid-column-gap: 40px;
  grid-row-gap: 30px;
}

#product-load-more {
  height: 50px;
}

.selected-filters {
  margin-top: 30px;
}

.filter-chip-selected {
  background-color: var(--primary-70) !important;
  color: var(--white) !important;
}
</style>
