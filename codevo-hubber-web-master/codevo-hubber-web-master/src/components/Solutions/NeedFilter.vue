<template>
  <div class="global-solution-list-filter-need position-relative">
    <div class="mb-5">
      <base-input
        solo
        :label="$t('FIND_A_NEED')"
        variant="search"
        v-model="needText"
        @keyup="onInputNeed"
        @click="onInputNeed"
      >
        <template #append-inner>
          <base-icon name="search" width="20" height="20" />
        </template>
      </base-input>

      <base-list
        ref="needList"
        v-if="showNeedDropdown"
        :is-loading="isNeedLoading"
        class="position-absolute"
        :items="needs"
        @change="onNeedSelected"
        infinite-scroll
        @load-more="searchNeed"
        label-property="description"
        value-property="id"
      />
    </div>

    <div class="selected-needs" v-if="selectedNeeds.length">
      <chip
        v-for="need in selectedNeeds"
        :key="need.value"
        class="chip-filter"
        selected
        clickable
        @click="onChipSelected(need)"
      >
        <span class="chip-title">{{ need.label }}</span>
      </chip>
    </div>
  </div>
</template>
<script setup>
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseList from '@/components/base/inputs/BaseList.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import { computed, ref } from 'vue'
import { debounce } from 'lodash'
import ProductService from '@/services/Product/ProductService'
import { onClickOutside } from '@vueuse/core'
import { useLoadMore } from '@/composables/useLoadMore'
import Chip from '@/components/base/buttons/Chip.vue'

const props = defineProps({
  filterValue: {
    type: [],
    required: true,
  },
})

const emit = defineEmits(['change'])

// NEED FILTER
const showNeedDropdown = ref(false)
const selectedNeeds = computed({
  get() {
    return props.filterValue ?? []
  },
  set(value) {
    emit('change', value)
  },
})
const isNeedLoading = ref(false)
const needText = ref('')
const onInputNeed = debounce(async () => {
  await searchNeed()
}, 500)

const { page, content: needs, setContent } = useLoadMore()
const searchNeed = async () => {
  if (needText.value.length === 0) needs.value = []

  if (needText.value.length > 2) {
    try {
      showNeedDropdown.value = true
      isNeedLoading.value = true

      const response = await new ProductService().searchNeed({
        description: needText.value,
        page: page.value,
      })

      setContent(response)
    } finally {
      isNeedLoading.value = false
    }
  }
}
const onNeedSelected = (need) => {
  selectedNeeds.value = need
  needText.value = ''
  page.value = 0
  showNeedDropdown.value = false
}

const onChipSelected = (need) => {
  selectedNeeds.value = need
}

const needList = ref(null)
onClickOutside(needList, () => (showNeedDropdown.value = false))
</script>

<style lang="scss" scoped>
.chip-filter {
  &.selected {
    background-color: var(--primary-70);
    color: var(--white);

    .chip-title {
      color: var(--white);
    }
  }
}

.selected-needs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
