<script>
export default {
  name: 'SystemDropdownIcon',

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
    height="26"
    viewBox="0 0 10 26"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :fill="pathColor || '#A6ACB5'"
      d="M3 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      fill-rule="evenodd"
    />
  </svg>
</template>
