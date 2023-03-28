<script setup>
import CloseIcon from '@/assets/icons/icon-system-close@2x.png'

const props = defineProps({
  selected: Boolean,
  clickable: Boolean,
  flat: Boolean,
  font: String,
})
const emit = defineEmits(['click'])

const onClick = () => {
  if (props.clickable !== false) {
    emit('click')
  }
}
</script>

<template>
  <div @click.prevent="onClick" class="container d-flex flex-row justify-center align-center rounded-pill"
       :class="[selected?'selected ':'not-selected ', clickable?'clickable':'', flat?'flat':'', font ? 'text-14' : '',]">
    <slot></slot>
    <img class="ml-3 close-icon" :src="CloseIcon" v-if="selected" />
  </div>
</template>

<style scoped>
.container {
  min-width: 60px;
  text-align: center;

  margin: 0 0px 0 0;
  padding: 6px 9px 7px;
  border-radius: 17px;
  opacity: 1;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  height: fit-content;
  width: fit-content;

  color: inherit;
  background-color: inherit;

  font-family: Ubuntu;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
}

.flat {
  border-radius: initial;
  box-shadow: initial;
}


.default-color {
  background-color: white;
}

.text-14 {
  font-size: 14px;
  font-weight: normal;
}
.selected {
  background-color: gray;
  color: white !important;
  padding-left: 15px;
  padding-right: 15px;
}

.not-selected {
  padding-left: 28px;
  padding-right: 29px;
}

.clickable {
  cursor: pointer;
}

.filter-chip * {
  color: inherit;
  background-color: inherit;
}

.close-icon {
  height: 15px;
  width: 15px;
}
</style>
