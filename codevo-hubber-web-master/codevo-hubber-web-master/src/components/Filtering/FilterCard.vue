<script setup>
import Chip from '@/components/base/buttons/Chip'
import CloseIconGray from '@/assets/icons/icon-system-close-gray@2x.png'
import { onMounted, reactive, ref } from 'vue'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import CustomSwitch from '@/components/base/inputs/CustomSwitch'
import TextButton from '@/components/base/buttons/TextButton'
import BaseSelect from '@/components/base/inputs/BaseSelect'

const props = defineProps({
  title: String,
  filters: Object,
  selected: Object,
  hasCustomReset: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close', 'confirm'])

let selectedFilters = reactive({})

onMounted(async () => {
  await prepareSelectedFilters(props.selected)
})

const prepareSelectedFilters = async (input) => {
  console.log('prepareSelectedFilters')
  // selectedFilters = {...(props.selected)} shallow clone not working
  console.log(input)
  for (const key in input) {
    let value = input[key]
    if (Array.isArray(value)) {
      selectedFilters[key] = [...value]
    } else {
      selectedFilters[key] = value
    }
  }
}

const onToggleFilter = (key, filter) => {
  let filterGroup = selectedFilters[key]
  if (filterGroup) {
    console.log(filterGroup)
    let filterIndex = Object.entries(filterGroup)?.findIndex(
      (filterItem, index) => {
        return filter?.value === filterGroup[index]?.value
      }
    )
    if (filterIndex !== -1) {
      filterGroup?.splice(filterIndex, 1)
    } else {
      filterGroup?.push(filter)
    }
  }
}

const isFilterSelected = (key, filter) => {
  let filterGroup = selectedFilters[key]
  if (filterGroup) {
    let filterIndex = Object.entries(filterGroup)?.findIndex(
      (filterItem, index) => {
        return filter?.value === filterGroup[index]?.value
      }
    )
    return filterIndex !== -1
  }
  return false
}

const onClose = () => {
  emit('close')
}

const onConfirm = async () => {
  console.log(selectedFilters)
  emit('confirm', { ...selectedFilters })
}

const onReset = async () => {
  let combined = [
    ...(props.filters?.chips ?? []),
    ...(props.filters?.switches ?? []),
    ...(props.filters?.selects ?? []),
  ]
  let emptyFilters = {}
  for (const [key, value] of Object.entries(combined)) {
    let objectKey = value?.key
    if (objectKey) {
      if ('value' in value) {
        emptyFilters[objectKey] = ref(false)
      } else if ('values' in value) {
        emptyFilters[objectKey] = []
      }
    }
  }
  await prepareSelectedFilters(emptyFilters)
}

// const isFilterFavourite = ref(true)
</script>

<template>
  <div class="filter-card">
    <!--    {{ isFilterFavourite }}-->
    <!--    <CustomSwitch v-model="isFilterFavourite">AAA</CustomSwitch>-->
    <div class="header d-flex flex-row align-center">
      <div class="title flex-grow-1">
        {{ title }}
      </div>

      <img
        :src="CloseIconGray"
        class="close-icon"
        v-on:click.prevent="onClose"
      />
    </div>

    <slot>
      <slot name="filter-before" />

      <div class="filter-switches-container">
        <div class="filter-switches">
          <div
            v-for="(item, index) in filters?.switches"
            :key="index"
            class="d-flex flex-row justify-space-between align-center"
          >
            <div class="filter-label">{{ item?.label }}</div>
            <div>
              <!--            {{ item?.key }}-->
              <!--            {{ selectedFilters[item?.key]}}-->
              <CustomSwitch
                :checked="selectedFilters[item?.key]"
                v-model="selectedFilters[item?.key]"
              ></CustomSwitch>
            </div>
          </div>
        </div>
        <div
          v-if="!hasCustomReset"
          class="d-flex justify-end reset"
          @click="onReset"
        >
          <TextButton @click="onReset">{{
            $t('RESET_FILTERS_CAPTION')
          }}</TextButton>
        </div>
      </div>
      <div v-for="(filter, index) in filters?.chips" :key="index" class="mt-8">
        <div class="filter-label">{{ $t(filter?.label) }}:</div>
        <div class="d-inline-flex flex-wrap filter-chips mt-5">
          <Chip
            v-for="(item, itemIndex) in filter?.values"
            :key="itemIndex"
            class="filter-chip"
            :selected="isFilterSelected(filter?.key, item)"
            :class="[
              item?.bgColor !== undefined ? 'text-white' : '',
              item?.bgColor === undefined && isFilterSelected(filter?.key, item)
                ? 'filter-chip-selected'
                : 'filter-chip-not-selected',
            ]"
            :style="{
              backgroundColor:
                item?.bgColor !== undefined ? item?.bgColor : 'inherit',
            }"
            :clickable="true"
            @click="onToggleFilter(filter?.key, item)"
          >
            <span class="chip-title" :class="{ 'has-color': item?.bgColor }">{{
              $t(item?.title)
            }}</span>
          </Chip>
        </div>
      </div>

      <div
        v-for="(item, index) in filters?.selects"
        :key="index"
        class="mt-8 filter-select-container"
      >
        <BaseSelect
          v-model="selectedFilters[item?.key]"
          :options="item?.values"
          :label="item?.label"
          label-property="title"
          value-property="value"
        />
      </div>

      <slot name="filter-after" />
    </slot>

    <div class="d-flex justify-end mt-6">
      <ButtonPrimaryDesktop @click="onConfirm">{{
        $t('PORTAL_COMFIRM_TITLE')
      }}</ButtonPrimaryDesktop>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-card {
  padding: 30px 57px 30px 60px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.title {
  font-family: Ubuntu;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: var(--primary);
}

.close-icon {
  cursor: pointer;
  height: 30px;
  width: 30px;
}

.filter-switches-container {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  gap: 30px 0px;
}

.filter-switches {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 30px 0px;
}

.filter-label {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.filter-chips {
  gap: 20px;
}

.chip-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
}

.filter-chip-not-selected {
  color: var(--text);
  background-color: var(--white);

  .chip-title {
    color: var(--text);

    &.has-color {
      color: var(--white);
    }
  }
}

.filter-chip-selected {
  background-color: var(--primary-70) !important;
  color: var(--white) !important;

  .chip-title {
    color: var(--white) !important;
  }
}

.filter-select-container {
  max-width: 350px;
}
</style>
