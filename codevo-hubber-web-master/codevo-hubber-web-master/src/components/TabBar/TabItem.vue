<script setup>
const props = defineProps({
  selected: Boolean,
})
const emit = defineEmits(['click'])

const onClick = () => {
  if (props.clickable !== false) {
    emit("click")
  }
}

</script>

<template>
  <div @click.prevent="onClick"
       class="container d-flex flex-row justify-center align-center clickable"
       :class="[selected?'selected ':'not-selected',]"
  >
    <slot></slot>
  </div>
</template>


<style scoped>
.container {
  height: 36px;
  padding: 10px 15px;
  opacity: 0.65;
  border-radius: 18px;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
}

.default-color {
  background-color: white;
}

.selected {
  color: var(--white);
  background-color: var(--primary);
}

.not-selected {
  color: var(--primary);
  background-color: var(--white);
}

.clickable {
  cursor: pointer;
}


</style>
