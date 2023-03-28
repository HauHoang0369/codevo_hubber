<template>
  <v-text-field
    class="custom-field"
    :error="hasError"
    :class="{ 'is-search': variant === 'search' }"
  >
    <template #append-inner>
      <slot name="append-inner"></slot>
    </template>
  </v-text-field>
</template>

<script setup>
defineProps({
  hasError: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: null,
  },
})
</script>

<style lang="scss">
.custom-field {
  &.is-search {
    .v-field {
      border: none;
      background-color: var(--background-blue);
    }
  }

  .v-field {
    border-radius: 17px;
    border: 1px solid rgba($color-celeste, 0.5);

    &.v-field--error:not(.v-field--dirty) {
      border-color: var(--rosso);
    }

    &--variant-filled {
      &.v-field--focused .v-field__overlay {
        background-color: var(--celeste);
        opacity: calc(0.16 * var(--v-theme-overlay-multiplier));
      }

      &.v-field--error:not(.v-field--dirty) .v-field__overlay {
        background-color: rgba($color-rosso, 0.1);
        opacity: 1;
      }

      &.v-field--error:not(.v-field--disabled) .v-label.v-field-label {
        color: var(--rosso);
      }

      &.v-field--focused .v-field__input {
        padding-top: 0;
      }

      &.v-field--focused .v-label.v-field-label--floating {
        bottom: -30px;
        top: 0;
      }

      .v-field__overlay {
        border-radius: 17px;
        background-color: var(--white);
      }

      .v-field__outline::before {
        border-style: none;
      }

      .v-field__outline::after {
        border-style: none;
      }
    }
  }

  .v-label {
    &.v-field-label {
      color: var(--text);
    }
  }

  &.v-input--density-default
    .v-field--variant-filled.v-field--focus
    .v-label.v-field-label--floating {
    bottom: 7px;
  }

  &.v-text-field input {
    color: var(--text);
  }

  .v-field__append-inner {
    padding-top: 0;
    align-items: center;
  }
}
</style>
