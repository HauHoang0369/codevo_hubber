<script>
export default {
  name: 'SystemInfoIcon',

  props: {
    pathColor: {
      type: String,
      default: 'currentColor',
    },
  },
}
</script>
<template>
  <svg
    height="21"
    viewBox="0 0 21 21"
    width="21"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5.5c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 8a.667.667 0 0 0-.667.667v6.666a.667.667 0 1 0 1.334 0V9.167A.667.667 0 0 0 10.5 8.5zm0-3.333a.667.667 0 1 0 0 1.333.667.667 0 0 0 0-1.333z"
      :fill="pathColor"
      fill-rule="evenodd"
    />
  </svg>
</template>
