<script>
export default {
  name: 'DeleteIcon',
  props: {
    pathColor: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <svg
    width="20"
    height="26"
    viewBox="0 0 10 26"
    xmlns="http://www.w3.org/2000/svg"
    :fill="pathColor || 'currentColor'"
  >
    <path
      d="M3 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      fill-rule="evenodd"
    />
  </svg>
</template>
