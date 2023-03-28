<template>
  <filter-card
    class="mb-7 global-solution-list-filter"
    @close="emit('close')"
    @confirm="onConfirmFilters"
    :title="$t('FILTER_BY_CAPTION')"
  >
    <div class="d-flex justify-end reset mt-16 mb-9" @click="onReset">
      <text-button @click="onReset">{{
        $t('RESET_FILTERS_CAPTION')
      }}</text-button>
    </div>

    <div class="global-solution-list-filter-item mb-5">
      <div class="filter-label">{{ $t('FILTER_BY_NEED') }}</div>
      <need-filter
        :filter-value="selectedNeed"
        @change="selectedNeed = $event"
      />
    </div>

    <div class="global-solution-list-filter-item">
      <div class="filter-label">{{ $t('FILTER_BY_MARKET') }}</div>
      <div>
        <market-filter
          :selected-items="selectedMarkets"
          @change="onSelectMarkets"
        />
        <div class="d-flex mt-4 market-list">
          <div v-for="market in selectedMarkets" :key="market.id">
            <auth-image
              v-if="market.imageUrl"
              :path="market.imageUrl"
              :width="30"
              :height="30"
            />
          </div>
        </div>
      </div>
    </div>
  </filter-card>
</template>

<script setup>
import FilterCard from '@/components/Filtering/FilterCard.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import NeedFilter from '@/components/Solutions/NeedFilter.vue'
import MarketFilter from '@/components/Solutions/MarketFilter.vue'
import { ref, unref } from 'vue'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import { cloneDeep } from 'lodash'

const props = defineProps({
  selectedFilters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'selected'])

const selectedMarkets = ref(cloneDeep(props.selectedFilters.markets))
const selectedNeed = ref({ ...props.selectedFilters.need })
const onSelectMarkets = (items) => (selectedMarkets.value = [...items])

const onConfirmFilters = () => {
  emit('selected', {
    markets: unref(selectedMarkets),
    need: unref(selectedNeed),
  })
  emit('close')
}

const onReset = () => {}
</script>

<style lang="scss">
.global-solution-list-filter-item {
  .market-list {
    gap: 12px;
  }
}
</style>
