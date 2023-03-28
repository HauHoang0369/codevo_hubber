<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import Grid from '@/components/base/Grid/Grid'
import ProductService from '@/services/Product/ProductService'
import { useStore } from 'vuex'
import CropCard from '@/components/CropCard/CropCard'

const store = useStore()

const user = computed(() => store.getters.getUser)

const crops = ref([])
const cropDataResponse = ref(null)
const cropGroups = ref([])

let cropsPageable = ref({
  page: 0,
  size: 9,
  sort: 'asc',
})

const selectedCropGroupId = ref(-1)

const isLoading = ref(false)

const cropGroupsAll = computed(() => {
  const allItems = {
    name: 'Tutte',
    value: -1,
    id: -1,
  }

  return [allItems].concat(
    cropGroups.value.map((item) => ({
      name: item.name,
      value: item.id,
      id: item.id,
    }))
  )
})

const fetchGlobalCrops = async (initialLoad, hideLoader) => {
  try {
    const response = await new ProductService().service.getGlobalCrops(
      user.value.contentLanguage.isoCode,
      selectedCropGroupId.value === -1 ? undefined : selectedCropGroupId.value,
      initialLoad ? { ...cropsPageable.value, size: 12 } : cropsPageable.value,
      hideLoader
    )

    if (!response?.content) {
      return
    }

    crops.value = [...crops.value, ...response.content]
    cropDataResponse.value = response
  } catch (error) {
    console.error(error)
  }
}

const fetchCropGroups = async () => {
  try {
    cropGroups.value = await new ProductService().service.getCropGroups(
      user.value.contentLanguage.isoCode
    )
  } catch (error) {
    console.error(error)
  }
}

const initialize = async () => {
  store.commit('setLoading', true)
  await Promise.all([fetchCropGroups(), fetchGlobalCrops(true)])
  store.commit('setLoading', false)
}

const onSelectCategory = (categoryId) => {
  selectedCropGroupId.value = categoryId
}

const numberOfCropsShown = computed(() => crops.value?.length)

const isLoadMoreInScreen = () => {
  let productsLoadMoreItem = document.querySelector('#product-load-more')
  // Check if our 0 height indicator item is in display,
  let pageTop = window.scrollY
  let pageBottom = pageTop + window.innerHeight
  let elementTop = productsLoadMoreItem.offsetTop
  return elementTop <= pageBottom
}

const onMoreProducts = async () => {
  if (cropsPageable.value.page <= 2) {
    cropsPageable.value.page = 2
  }

  cropsPageable.value.page += 1
  await fetchGlobalCrops(false, true)
}

const onHandleCropsGridScroll = async () => {
  // Only load new items if our indicator is in display and we are not on the last page
  if (isLoadMoreInScreen() && cropDataResponse.value?.last === false) {
    // remove scroll listener while loading new products
    try {
      isLoading.value = true
      window.removeEventListener('scroll', onHandleCropsGridScroll)
      await onMoreProducts()
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
      window.addEventListener('scroll', onHandleCropsGridScroll)
    }
  }
}

const resetCrops = () => {
  crops.value = []
  cropsPageable.value.page = 0
  cropDataResponse.value = null
}

onMounted(async () => {
  try {
    await initialize()
    // Add scroll listener only if there are products loaded and more than one page
    if (
      cropDataResponse.value?.first === true &&
      cropDataResponse.value?.last === false
    ) {
      window.addEventListener('scroll', onHandleCropsGridScroll)
    }
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(async () => {
  window.removeEventListener('scroll', onHandleCropsGridScroll)
})

watch(selectedCropGroupId, async () => {
  resetCrops()

  store.commit('setLoading', true)
  await fetchGlobalCrops(true, false)
  store.commit('setLoading', false)
})
</script>

<template>
  <div>
    <TopMenu
      :categories="cropGroupsAll"
      :selected-category-id="selectedCropGroupId"
      @select-category="onSelectCategory"
    ></TopMenu>
    <TopFilters
      :value="numberOfCropsShown"
      :total="cropDataResponse?.totalElements"
      type="soluzioni"
      :is-filter-enabled="false"
    />
    <div class="content">
      <Grid xl="3" lg="2" md="2" sm="1" :column-gap="30" :row-gap="30">
        <CropCard v-for="crop in crops" :key="crop.id" :crop="crop" />
      </Grid>

      <div id="product-load-more" class="w-100">
        <div v-if="isLoading" class="text-center pt-10 pb-16">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.top-filters-menu .filter-message {
  font-weight: 400;
}
.content {
  height: 100%;
  flex-grow: 1;
}
</style>
