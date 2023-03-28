<template>
  <filter-card
    class="mb-7 solution-list-filter"
    @close="emit('close')"
    @confirm="onConfirmFilters"
    :title="$t('FILTER_BY_CAPTION')"
    :has-custom-reset="true"
  >
    <div class="solution-list-filter-item mb-5">
      <div class="filter-label">{{ $t('SHOW_ONLY_FAVOURITES') }}</div>
      <custom-switch
        v-model="selectedFilterValues.onlyFavourites"
      ></custom-switch>

      <div class="d-flex justify-end reset" @click="onReset">
        <text-button @click="onReset">{{
          $t('RESET_FILTERS_CAPTION')
        }}</text-button>
      </div>
    </div>

    <div class="solution-list-filter-item mb-5">
      <div class="filter-label">{{ $t('FILTER_BY_NEED') }}</div>
      <need-filter
        :filter-value="selectedFilterValues.needs"
        @change="onNeedSelected"
      />
    </div>

    <div class="solution-list-filter-item full-width mb-7">
      <div class="filter-label mb-5">{{ $t('FILTER_BY_CROP_CAPTION') }}</div>
      <chip-filter
        value-key="id"
        label-key="description"
        filter-key="crops"
        :selected-filters="selectedFilterValues.crops"
        :items="filterData.crops"
        @selected="onChipSelected($event)"
      />
    </div>

    <div class="solution-list-filter-item full-width mb-7">
      <div class="filter-label mb-5">{{ $t('FILTER_BY_SOIL') }}</div>
      <chip-filter
        value-key="id"
        label-key="description"
        filter-key="soils"
        :selected-filters="selectedFilterValues.soils"
        :items="filterData.soils"
        @selected="onChipSelected($event)"
      />
    </div>

    <div class="solution-list-filter-item full-width mb-7">
      <div class="filter-label mb-5">
        {{ $t('FILTER_BY_PHENOLOGICAL_PHASE') }}
      </div>
      <chip-filter
        value-key="id"
        label-key="description"
        filter-key="phenologicalPhaseIds"
        :selected-filters="selectedFilterValues.phenologicalPhaseIds"
        :items="filterData.phenologicalPhaseIds"
        @selected="onChipSelected($event)"
      />
    </div>

    <div class="solution-list-filter-item full-width mb-7">
      <div class="filter-label mb-5">
        {{ $t('FILTER_BY_GROWER_SEGMENTATION') }}
      </div>
      <chip-filter
        value-key="id"
        label-key="name"
        filter-key="growerSegmentations"
        :selected-filters="selectedFilterValues.growerSegmentations"
        :items="filterData.growerSegmentations"
        @selected="onChipSelected($event)"
      />
    </div>
  </filter-card>
</template>

<script setup>
import FilterCard from '@/components/Filtering/FilterCard.vue'
import TextButton from '@/components/base/buttons/TextButton.vue'
import NeedFilter from '@/components/Solutions/NeedFilter.vue'
import { ref } from 'vue'
import CustomSwitch from '@/components/base/inputs/CustomSwitch.vue'
import { cloneDeep } from 'lodash'
import ChipFilter from '@/components/Filters/ChipFilter.vue'

const props = defineProps({
  selectedFilters: {
    type: Object,
    required: true,
  },
  filterData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'selected'])

const onConfirmFilters = () => {
  emit('selected', selectedFilterValues.value)
  emit('close')
}

const onReset = () => {
  selectedFilterValues.value = {
    onlyFavourites: false,
    needs: [],
    crops: [],
    soils: [],
    phenologicalPhaseIds: [],
    growerSegmentations: [],
  }

  emit('selected', selectedFilterValues.value)
}

const selectedFilterValues = ref({
  onlyFavourites: props.selectedFilters.onlyFavourites,
  needs: cloneDeep(props.selectedFilters.needs),
  crops: cloneDeep(props.selectedFilters.crops),
  soils: cloneDeep(props.selectedFilters.soils),
  phenologicalPhaseIds: cloneDeep(props.selectedFilters.phenologicalPhaseIds),
  growerSegmentations: cloneDeep(props.selectedFilters.growerSegmentations),
})

// CHIP FILTER
const onChipSelected = ({ key, id }) => {
  const index = selectedFilterValues.value[key].indexOf(id)
  if (index > -1) {
    selectedFilterValues.value[key].splice(index, 1)
  } else {
    selectedFilterValues.value[key].push(id)
  }
}

const onNeedSelected = (need) => {
  const index = selectedFilterValues.value.needs.findIndex(
    (item) => item.id === need.id
  )
  if (index > -1) {
    selectedFilterValues.value.needs.splice(index, 1)
  } else {
    selectedFilterValues.value.needs.push(need)
  }
}
</script>

<style lang="scss">
.solution-list-filter {
  .loading-spinner {
    margin: auto;
  }
}

.solution-list-filter-item {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  .filter-label {
    color: var(--text);
  }

  &.full-width {
    display: block;
  }

  .v-input__details {
    display: none;
  }
}
</style>
