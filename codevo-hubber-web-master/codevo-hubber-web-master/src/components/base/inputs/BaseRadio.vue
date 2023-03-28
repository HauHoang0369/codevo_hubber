<template>
  <label class="base-radio">
    <input v-bind="$attrs" v-model="value" type="radio" />
    <span class="base-radio-icon">
      <span />
    </span>
    <span class="base-radio-content">
      <slot />
    </span>
  </label>
</template>
<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
<style lang="scss">
.base-radio {
  display: flex;
  align-items: center;
  margin: 0;
  column-gap: 12px;
  cursor: pointer;

  input {
    display: none;

    &:checked {
      & ~ .base-radio-icon {
        span {
          background-color: var(--primary);
        }
      }
    }
  }

  .base-radio-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    border: 1px solid var(--celeste);
    background-color: transparent;

    span {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 9999px;
      background-color: transparent;
      transition: all 0.15s;
    }
  }

  .base-radio-content {
    flex: 1;
  }
}
</style>
