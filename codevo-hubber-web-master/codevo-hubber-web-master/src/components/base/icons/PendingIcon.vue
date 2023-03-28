<template>
  <svg width="32" height="31" viewBox="0 0 32 31" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28.551 1.5H3.508C1.786 1.5.393 2.805.393 4.4L.377 30.5l6.261-5.8h21.913c1.722 0 3.13-1.305 3.13-2.9V4.4c0-1.595-1.408-2.9-3.13-2.9zM18.117 18.9h-3.13V16h3.13v2.9zm0-5.8h-3.13V7.3h3.13v5.8z"
      :fill="fillColor"
      fill-rule="nonzero" />
  </svg>
</template>

<script setup>
defineProps({
  fillColor: {
    type: String,
    default: '#E2E4E7'
  }
})
</script>
