<script>
export default {
  name: 'MarketIcon',

  props: {
    pathColor: {
      type: String,
      default: '',
    }
  }
}
</script>
<template>
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 2a1 1 0 0 1 1 1h11a2 2 0 0 1 2 2v1h6.12a1 1 0 0 1 .83 1.559l-2.556 3.795a1 1 0 0 0-.008 1.105l2.605 3.995A1 1 0 0 1 25.154 18H12a2 2 0 0 1-2-2H6v13a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"
      :fill="pathColor || '#E2E4E7'" fill-rule="evenodd" />
  </svg>
</template>
