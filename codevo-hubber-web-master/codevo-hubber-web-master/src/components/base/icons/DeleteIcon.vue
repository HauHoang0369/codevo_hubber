<script>
export default {
  name: 'DeleteIcon',
  props: {
    pathColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 1a1 1 0 0 1 1 1h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1-1h8zm5 5v21a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6h18zM11 8a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z"
      :fill="pathColor || 'currentColor'" fill-rule="evenodd" />
  </svg>
</template>
