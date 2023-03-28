<script setup>
import TopMenu from '@/components/TopMenu/TopMenu'
import TopFilters from '@/components/TopFilters/TopFilters'
import SolutionCard from '@/components/SolutionCard/SolutionCard'
import { computed, onMounted, reactive, ref } from 'vue'
import ProductService from '@/services/Product/ProductService'
import { useStore } from 'vuex'
import Observer from '@/components/base/Observer/Observer.vue'
import { useLoadMore } from '@/composables/useLoadMore'
import SolutionFilter from '@/views/Solutions/SolutionFilter.vue'

const store = useStore()

const user = computed(() => store.getters.getUser)

const cropGroups = ref([
  {
    name: 'Tutte',
    value: -1,
  },
])
const selectedCropGroupId = ref(-1)
const isLastPage = ref(false)
const totalElements = ref(0)

// FETCH DATA
const filterData = reactive({
  crops: [],
  soils: [],
  phenologicalPhaseIds: [],
  growerSegmentations: [],
})
const filterPageable = ref({
  page: 0,
  size: 100,
  sort: 'asc',
})
onMounted(async () => {
  try {
    await loadSolutionListNextPage()

    isLoading.value = true

    const service = new ProductService().service

    // Get filter options data from APIs
    const [crops, soils, cropStages, knowledgeLevels, groups] =
      await Promise.all([
        service.getCrops(
          user.value.contentLanguage.isoCode,
          filterPageable.value
        ),
        service.getSoils(
          user.value.contentLanguage.isoCode,
          filterPageable.value
        ),
        service.getCropStages(
          user.value.contentLanguage.isoCode,
          filterPageable.value
        ),
        service.getKnowledgeLevel(
          user.value.contentLanguage.isoCode,
          filterPageable.value
        ),
        service.getCropGroups(user.value.contentLanguage.isoCode),
      ])

    filterData.crops = crops.content
    filterData.soils = soils.content
    filterData.phenologicalPhaseIds = cropStages.content
    filterData.growerSegmentations = knowledgeLevels.content

    const formattedGroups = groups.map(({ id, name }) => ({
      value: id,
      name,
    }))
    cropGroups.value = [...cropGroups.value, ...formattedGroups]
  } finally {
    isLoading.value = false
  }
})

const isLoading = ref(false)
const { page, content: solutions, setContent } = useLoadMore()
const loadSolutionListNextPage = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true

    const pageable = {
      page: page.value,
      size: 10,
      sort: 'asc',
    }

    const solutionData = await new ProductService().service.getSolutions({
      cropGroupId: selectedCropGroupId.value,
      marketId: user.value.market.id,
      contentLanguage: user.value.contentLanguage.isoCode,
      onlyFavourites: filters.onlyFavourites,
      needs: filters.needs.map((need) => need.value),
      crops: [...filters.crops],
      soils: [...filters.soils],
      phenologicalPhaseIds: [...filters.phenologicalPhaseIds],
      growerSegmentations: [...filters.growerSegmentations],
      pageable,
    })

    setContent(solutionData)

    isLastPage.value = solutionData.last
    totalElements.value = solutionData.totalElements
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const onSelectCategory = (categoryId) => {
  selectedCropGroupId.value = categoryId
  loadSolutionListNextPage()
}

const onLoadMore = () => {
  loadSolutionListNextPage()
}

const filteredData = computed({
  get() {
    // TODO: Will be used for category filtering. Solution Data do not have any categgory information atm!
    return solutions.value
  },
})

// FILTERS
const showFilterCard = ref(false)
const onToggleFilterCard = () => {
  showFilterCard.value = !showFilterCard.value
}

const filters = reactive({
  onlyFavourites: false,
  needs: [],
  crops: [],
  soils: [],
  phenologicalPhaseIds: [],
  growerSegmentations: [],
})

const onFiltersSelected = async ({
  onlyFavourites = false,
  needs,
  crops,
  soils,
  phenologicalPhaseIds,
  growerSegmentations,
}) => {
  filters.onlyFavourites = onlyFavourites
  filters.needs = needs
  filters.crops = [...crops]
  filters.soils = [...soils]
  filters.phenologicalPhaseIds = [...phenologicalPhaseIds]
  filters.growerSegmentations = [...growerSegmentations]

  page.value = 0
  isLoading.value = false

  await onLoadMore()
}
</script>

<template>
  <div>
    <top-menu
      :selected-category-id="selectedCropGroupId"
      :categories="cropGroups"
      @select-category="onSelectCategory"
    />

    <top-filters
      class="mb-8"
      :value="solutions.length"
      :total="totalElements"
      type="soluzioni"
      @toggle="onToggleFilterCard"
      :is-filter-enabled="!isLoading"
    />

    <solution-filter
      v-if="showFilterCard"
      :selected-filters="filters"
      :filter-data="filterData"
      @close="showFilterCard = false"
      @selected="onFiltersSelected"
    />

    <div class="solution-list">
      <solution-card
        :solution-data="item"
        v-for="(item, index) in filteredData"
        :key="index"
      />

      <div
        v-if="isLoading"
        class="d-flex spinning justify-center align-center pt-3"
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </div>
      <Observer v-if="!isLastPage" @intersect="onLoadMore" />
    </div>
  </div>
</template>

<style lang="scss"></style>
