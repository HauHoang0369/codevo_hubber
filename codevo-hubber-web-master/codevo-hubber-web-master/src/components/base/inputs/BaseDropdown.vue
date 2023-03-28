<template>
  <div ref="dropdown" class="base-dropdown position-relative">
    <base-icon name="dropdown" width="10" height="26" @click="onToggle" />
    <base-list
      v-if="show"
      class="position-absolute"
      :items="items"
      label-property="title"
      value-property="value"
      @change="onItemChange"
    />
  </div>
</template>

<script setup>
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import BaseList from '@/components/base/inputs/BaseList.vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['change'])

const show = ref(false)
const onItemChange = (value) => emit('change', value)

const dropdown = ref(null)
onClickOutside(dropdown, () => (show.value = false))

const onToggle = () => {
  show.value = !show.value
}
</script>

<style lang="scss">
.base-dropdown {
  .base-list-item {
    width: 275px;
    font-size: 14px;
    left: 0;
  }

  .base-list {
    transform: translate(-100%);
  }
}
</style>
