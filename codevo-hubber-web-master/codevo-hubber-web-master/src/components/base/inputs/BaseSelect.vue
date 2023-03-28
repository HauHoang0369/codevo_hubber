<template>
  <div class="base-select">
    <base-input
      v-model="activeItem"
      readonly
      v-bind="attrs"
      @click="showList = !showList"
    >
      <template #append-inner>
        <base-icon
          name="chevronDown"
          width="20"
          height="20"
          class="base-select__icon"
          @click="showList = !showList"
        />
      </template>
    </base-input>

    <base-list
      v-if="showList"
      class="base-select__list"
      ref="baseSelect"
      :items="options"
      :active="model"
      @change="onSelectionChange"
      :label-property="labelProperty"
      :value-property="valueProperty"
    ></base-list>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import BaseInput from '@/components/base/inputs/BaseInput'
import BaseList from '@/components/base/inputs/BaseList'

import { useAttrs, ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  customLabel: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

// Implement click-outside logic
import { onClickOutside } from '@vueuse/core'
import { isEmpty } from 'lodash'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
const baseSelect = ref(null)
onClickOutside(baseSelect, () => (showList.value = false))

const attrs = useAttrs()
const {
  'label-property': labelProperty = 'label',
  'value-property': valueProperty = 'value',
} = attrs

// Handle on selection change
const showList = ref(false)
const onSelectionChange = ({ value }) => {
  showList.value = false
  model.value = value
}


const activeItem = computed(() => {
  if (isEmpty(props.options)) return null

  if (!isEmpty(props.customLabel)) return props.customLabel

  return props.options.find(
    (option) => option[valueProperty] === Number(model.value)
  )?.[labelProperty]
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(model) {
    emit('update:modelValue', model)
  },
})
</script>

<style lang="scss">
.base-select {
  position: relative;
  width: 100%;

  &__icon {
    cursor: pointer;
  }

  &__list {
    width: 100%;
    position: absolute;
    top: 60px;
    z-index: 1000;
  }

  .custom-field .v-field.v-field--focused .v-field__input {
    padding-top: 0; // 16px
  }
}
</style>
