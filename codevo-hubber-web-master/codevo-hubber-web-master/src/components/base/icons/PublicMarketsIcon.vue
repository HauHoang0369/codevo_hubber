<script setup>
const props = defineProps({
  isVisible: Boolean,
})
</script>

<template>
  <svg
    width="30" 
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    v-if="isVisible === true"
    style="cursor: pointer"
    fill="#00604B"
  >
  <g id="Icon_x2F_system_x2F_show-hide">
    <g id="mostra_x2F_nascondi" transform="translate(0.500000, 0.500000)">
      <path id="Shape" class="st0" d="M14.5,0C6.4,0,0,6.4,0,14.5S6.4,29,14.5,29S29,22.6,29,14.5S22.6,0,14.5,0z M14.5,27.2
        c-6.9,0-12.7-5.6-12.7-12.7c0-6.9,5.6-12.7,12.7-12.7c6.9,0,12.7,5.6,12.7,12.7C27.2,21.4,21.4,27.2,14.5,27.2z"/>
      <path id="Path" class="st0" d="M14.5,6.4c-0.5,0-1,0-1.4,0.2c0.5,0.5,0.8,1.3,0.8,1.9c0,1.6-1.3,2.9-2.9,2.9
        c-1.3,0-2.3-0.8-2.7-1.9c-1,1.3-1.6,2.9-1.6,4.7c0,4.4,3.5,7.9,7.9,7.9s7.9-3.5,7.9-7.9C22.4,10.1,18.9,6.4,14.5,6.4z"/>
    </g>
  </g>
  </svg>

  <svg
    width="30" 
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    v-else
    style="cursor: pointer"
    fill="#A6ACB5"
  >
  <g id="Icon_x2F_system_x2F_show-hide">
    <g id="mostra_x2F_nascondi" transform="translate(0.500000, 0.500000)">
      <path id="Shape" class="st0" d="M14.5,0C6.4,0,0,6.4,0,14.5S6.4,29,14.5,29S29,22.6,29,14.5S22.6,0,14.5,0z M14.5,27.2
        c-6.9,0-12.7-5.6-12.7-12.7c0-6.9,5.6-12.7,12.7-12.7c6.9,0,12.7,5.6,12.7,12.7C27.2,21.4,21.4,27.2,14.5,27.2z"/>
      <path id="Path" class="st0" d="M14.5,6.4c-0.5,0-1,0-1.4,0.2c0.5,0.5,0.8,1.3,0.8,1.9c0,1.6-1.3,2.9-2.9,2.9
        c-1.3,0-2.3-0.8-2.7-1.9c-1,1.3-1.6,2.9-1.6,4.7c0,4.4,3.5,7.9,7.9,7.9s7.9-3.5,7.9-7.9C22.4,10.1,18.9,6.4,14.5,6.4z"/>
    </g>
  </g>
  </svg>
</template>
