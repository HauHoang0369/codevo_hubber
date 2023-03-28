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
  style="cursor: pointer"
  v-if="isVisible === true"
  fill="#FFDB72">
    <g id="Icon_x2F_system_x2F_active-inactive">
      <g id="Visibilità_prodotto_inactive_48px" transform="translate(3.000000, 0.500000)">
        <path id="Shape" class="st0" d="M11.9,0L0,5.2v7.9C0,20.5,5,27.3,11.9,29c6.8-1.7,11.9-8.5,11.9-15.8V5.2L11.9,0z M9.2,21.1
          l-5.3-5.3l1.8-1.8l3.4,3.4L18,8.7l1.8,1.8L9.2,21.1z"/>
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
  <g id="Icon_x2F_system_x2F_active-inactive">
      <g id="Visibilità_prodotto_inactive_48px" transform="translate(3.000000, 0.500000)">
        <path id="Shape" class="st0" d="M11.9,0L0,5.2v7.9C0,20.5,5,27.3,11.9,29c6.8-1.7,11.9-8.5,11.9-15.8V5.2L11.9,0z M9.2,21.1
          l-5.3-5.3l1.8-1.8l3.4,3.4L18,8.7l1.8,1.8L9.2,21.1z"/>
      </g>
    </g>
  </svg>
</template>
