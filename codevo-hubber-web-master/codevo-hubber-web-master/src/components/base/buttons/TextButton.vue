<script setup>
const emit = defineEmits(['click'])
const onClick = () => {
  emit('click')
}
</script>
<template>
  <div class="CTAbuttontertiarydesktop" @click.stop="onClick">
    <slot></slot>
  </div>
</template>

<style scoped>
.CTAbuttontertiarydesktop {
  width: 121px;
  height: 16px;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.78px;
  color: var(--primary);
  cursor: pointer;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
