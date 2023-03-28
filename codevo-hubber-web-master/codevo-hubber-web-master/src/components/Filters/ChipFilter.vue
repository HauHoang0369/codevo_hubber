<template>
  <div class="d-flex flex-wrap chip-filters">
    <template v-for="item in items">
      <chip
        v-if="item[labelKey]"
        class="chip-filter"
        :key="item.id"
        clickable
        :selected="isChipSelected(item)"
        @click="onChipSelected(item[valueKey])"
      >
        <span class="chip-title">{{ item[labelKey] }}</span>
      </chip>
    </template>
  </div>
</template>

<script setup>
import Chip from '@/components/base/buttons/Chip.vue'
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
  filterKey: {
    type: String,
    required: true,
  },
  labelKey: {
    type: String,
    required: true,
  },
  valueKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['selected'])

// CHIP FILTER
const onChipSelected = (id) => {
  emit('selected', {
    key: props.filterKey,
    id,
  })
}

const selectedFilters = computed(() => props.selectedFilters)

const isChipSelected = (item) => {
  return selectedFilters.value.indexOf(item[props.valueKey]) > -1
}
</script>

<style lang="scss">
.chip-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .chip-title {
    color: var(--text);
  }

  .chip-filter {
    &.selected {
      background-color: var(--primary-70);
      color: var(--white);

      .chip-title {
        color: var(--white);
      }
    }
  }
}
</style>
