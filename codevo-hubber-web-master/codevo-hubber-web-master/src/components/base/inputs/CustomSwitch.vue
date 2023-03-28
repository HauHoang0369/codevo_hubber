<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: null,
  rules: undefined,
  disabled: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const defaultRules = {
  required: (value) => {
    return !!value || 'Required.'
  },
}
</script>
<template>
  <v-switch
    v-model="model"
    inset
    dense
    :rules="rules !== undefined ? rules : [defaultRules.required]"
    hide-details
    class="custom-switch"
    :disabled="disabled"
  />
</template>

<style lang="scss" scoped>
.custom-switch {
  &::v-deep(.v-input__control) {
    .v-switch__track {
      border-radius: 15px;
      width: 60px;
      height: 30px;
      box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.2);
      background-color: var(--grey);
    }

    .v-switch__thumb {
      width: 26px;
      height: 26px;
    }

    .v-selection-control__input {
      width: 26px;
      height: 26px;
      transform: translateX(-15px);
    }

    .v-selection-control--dirty {
      .v-switch__track {
        box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3), inset 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        background-image: linear-gradient(to top, var(--primary), var(--primary-dark));
      }

      .v-selection-control__input {
        transform: translateX(14px);
      }
    }

    //.v-selection-control--disabled {
    //  opacity: 0.2;
    //
    //  .v-switch__track {
    //    background: var(--grey-dark);;
    //  }
    //}

  }

}
</style>
