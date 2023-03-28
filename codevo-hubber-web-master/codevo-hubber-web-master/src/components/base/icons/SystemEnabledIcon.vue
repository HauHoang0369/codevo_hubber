<script setup>
const props = defineProps({
  isActive: Boolean,
})
</script>

<template>
  <svg
  width="30" 
  height="30"
  viewBox="0 0 30 30"
  xmlns="http://www.w3.org/2000/svg"
  style="cursor: pointer"
  fill="#00604B"
  v-if="isActive === true">
  <path class="st0" d="M15,0.5C7,0.5,0.5,7,0.5,15S7,29.5,15,29.5S29.5,23,29.5,15S23,0.5,15,0.5z M13.3,22.9l-6.5-7.5l2.1-1.7
	l4.4,5.1L23,8.4l2.1,1.9L13.3,22.9z"/>
  </svg>
  <svg
    width="30" 
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    fill="#FF516E"
    v-else
    style="cursor: pointer">
    <path class="st0" d="M15,0.5C7,0.5,0.5,7,0.5,15S7,29.5,15,29.5S29.5,23,29.5,15S23,0.5,15,0.5z M14.8,26.8
	C8.4,26.9,3.1,21.6,3.1,15c0-2.6,0.8-5,2.2-7.1L22,24.6C20,25.9,17.6,26.8,14.8,26.8z M24,22.7L7.3,6c2.1-1.7,4.8-2.9,7.7-2.9
	c6.6,0,11.9,5.3,11.9,11.9C26.9,17.9,25.8,20.6,24,22.7z"/>
  </svg>
</template>
