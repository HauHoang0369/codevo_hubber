<script setup>
const props = defineProps({
  label: String,
  disabled: Boolean,
  bgStyle: Object ?? null,
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (props.disabled === false) {
    emit('click')
  }
}
</script>
<template>
  <button
    type="submit"
    class="primary-button rounded-pill pl-5 pr-5"
    @click.stop="onClick"
    :class="[
      disabled ? 'primary-button-disabled' : '',
      bgStyle === undefined ? 'default-background' : '',
    ]"
    :style="{ ...bgStyle }"
  >
    <div
      class="font-weight-bold d-flex flex-column justify-center align-center button-label"
    >
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.primary-button {
  height: 48px;
  font-size: 1em;
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
}

.button-label {
  color: var(--white);
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0.78px;
}

.default-background {
  background-image: linear-gradient(to top, var(--primary), var(--primary-dark));
}

.primary-button-disabled {
  border-radius: 24px;
  cursor: default;
  background: white;
  box-shadow: none;

  .button-label {
    color: $color-grey-dark !important;
  }
}
</style>
