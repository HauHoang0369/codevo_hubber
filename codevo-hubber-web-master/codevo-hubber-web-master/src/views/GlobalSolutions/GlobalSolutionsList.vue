<template>
  <div class="global-solution-list">
    <top-filters
      :value="5"
      :total="10"
      type="soluzioni globali"
      @toggle="onToggleFilterCard"
    />

    <auth-image
      class="global-solution-crop-image"
      v-if="chosenCrop?.backgroundImageUrl"
      :path="chosenCrop.backgroundImageUrl"
    />

    <global-solutions-filter
      v-if="showFilterCard"
      :selected-filters="filters"
      @close="showFilterCard = false"
      @selected="onFiltersSelected"
    />

    <div class="solution-cards">
      <solution-card
        v-for="solution in solutions"
        :key="solution.id"
        :solution="solution"
      />
    </div>

    <div
      v-if="isLoading"
      class="d-flex spinning justify-center align-center pt-3"
    >
      <v-progress-circular indeterminate size="50"></v-progress-circular>
    </div>

    <Observer @intersect="getGlobalSolutions" />
  </div>
</template>

<script setup>
import TopFilters from '@/components/TopFilters/TopFilters.vue'

import { computed, onMounted, reactive, ref } from 'vue'
import GlobalSolutionsFilter from '@/views/GlobalSolutions/GlobalSolutionsFilter.vue'
import SolutionCard from '@/views/GlobalSolutions/SolutionCard.vue'
import ProductService from '@/services/Product/ProductService'
import { useStore } from 'vuex'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import { useLoadMore } from '@/composables/useLoadMore'
import Observer from '@/components/base/Observer/Observer.vue'

const store = useStore()
const chosenCrop = computed(() => store.state.global_solutions.chosenCrop)

// FILTERS
const showFilterCard = ref(false)
const onToggleFilterCard = () => {
  showFilterCard.value = !showFilterCard.value
}

const filters = reactive({
  need: null,
  markets: [],
})
const onFiltersSelected = async ({ need, markets }) => {
  filters.need = need
  filters.markets = markets
  page.value = 0

  await getGlobalSolutions()
}

const isLoading = ref(false)
onMounted(async () => {
  await getGlobalSolutions()
})

const { page, content: solutions, setContent } = useLoadMore()
const getGlobalSolutions = async () => {
  try {
    if (!chosenCrop.value || isLoading.value) return

    isLoading.value = true

    const data = await new ProductService().getGlobalSolutions({
      crop: chosenCrop.value.id,
      need: filters.need?.value,
      markets: filters.markets.map((market) => market.id),
      page: page.value,
    })

    setContent(data)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.global-solution-list {
  .filter-message {
    font-size: 14px;
    font-weight: normal;
  }

  &-filter-item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;

    .v-input__details {
      display: none;
    }
  }

  .global-solution-crop-image {
    width: 100%;
    height: 196px;
    border-radius: 30px;
    box-shadow: 0 6px 25px -6px var(--grey-teal-30);
    object-fit: cover;
    margin: 30px 0;
  }

  .solution-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 40px;
  }
}
</style>
