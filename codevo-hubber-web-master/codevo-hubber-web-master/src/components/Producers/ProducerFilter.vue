<script setup>
import { ref } from 'vue';

import FilterCard from '@/components/Filtering/FilterCard'
import FilterIcon from '@/components/base/icons/FilterIcon';

const emit = defineEmits(['changeFilter']);

defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  selectedFilters: {
    type: Object,
    default: () => ({})
  }
});

const showFilterBox = ref(false);

const onConfirmFilters = (selectedFiltersData) => {
  emit('changeFilter', { ...selectedFiltersData })
  closeFilterBox();
};

const openFilterBox = () => {
  showFilterBox.value = true;
};

const closeFilterBox = () => {
  showFilterBox.value = false;
};

</script>

<template>
  <div>
    <div class="d-flex justify-end align-center w-100">

      <span class="filter-btn" @click="openFilterBox">
        <FilterIcon />
      </span>
    </div>

    <div v-if="showFilterBox" class="filter-box" v-click-outside="closeFilterBox">
      <FilterCard
        v-on:close="closeFilterBox"
        v-on:confirm="onConfirmFilters"
        :title="$t('FILTER_BY_CAPTION')"
        :filters="filters"
        :selected="selectedFilters"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  width: 48px;
  height: 48px;
  margin-left: 10px;
  border-radius: 13px;
  flex-shrink: 0;

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.filter-box {
  margin-top: 30px;

  .filter-card {
    padding: 30px;

    &::v-deep(.filter-chips) {
      gap: 10px;
    }

    &::v-deep(.not-selected) {
      padding: 7px 21px;
    }

    &::v-deep(.filter-switches-container) {
      margin-top: 30px;
    }
  }
}
</style>
