<template>
  <div class="base-icon d-flex align-center">
    <span :class="{ 'mr-2': $slots.left }">
      <slot name="left" />
    </span>
    <component
      v-bind="$attrs"
      :is="svg"
      :width="width"
      :height="height"
      :fill="color"
    />
    <span :class="{ 'ml-2': $slots.default }">
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'box',
  },
  width: {
    type: [Number, String],
    default: 30,
  },
  height: {
    type: [Number, String],
    default: 30,
  },
  color: {
    type: String,
    default: '#A6ACB5',
  },
})

const svg = computed(() => {
  return defineAsyncComponent(() =>
    import(`@/components/base/icons/${capitalize(props.name)}Icon.vue`)
  )
})

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<style lang="scss">
.base-icon {
  cursor: pointer;
}
</style>
