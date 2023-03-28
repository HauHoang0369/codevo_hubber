<script setup>
import { ref } from 'vue'

const props = defineProps({
  isRequired: Boolean,
  value: String, // the initial input value
  label: String, // the title at the top of the input
  placeholder: String, // the input's placeholder
  disabled: Boolean, // disabled attribute for input
  rules: undefined,
})

const defaultRules = {
  required: (value) => {
    if (!props.isRequired) return true

    return !!value || 'Required.'
  },
}
const isError = ref(false)
</script>

<template>
  <div class="input-container" :class="{ error: isError }">
    <v-textarea
      v-bind="$attrs"
      :rules="rules !== undefined ? rules : [defaultRules.required]"
      variant="plain"
      density="comfortable"
      :label="label"
      hide-details
      class="custom-input-text"
      :disabled="disabled"
    >
    </v-textarea>
  </div>
</template>

<style lang="scss">
.input-container {
  position: relative;
  padding: 8px 15px;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.8);
  font-size: 16px;
  background-color: var(--white);

  .v-label {
    &.v-field-label {
      color: var(--text);
    }
  }

  .v-textarea .v-field--active textarea {
    color: var(--text);
  }

  .custom-input-text >>> .v-field__input {
    color: var(--text);
  }

  .custom-input-text >>> .v-input__append i {
    color: var(--text);
  }

  .custom-input-label {
    color: var(--grey-dark);
  }

  /* Error styling */
  &.error {
    border: solid 1px var(--rosso);
    background-color: rgba(255, 81, 110, 0.1);
  }

  &.error .custom-input-text >>> .v-field__input {
    color: var(--rosso);
  }

  &.error .custom-input-text >>> .v-field__input::placeholder {
    color: var(--rosso);
    opacity: 1;
  }

  &.error .custom-input-label {
    color: var(--rosso);
  }
}
</style>
