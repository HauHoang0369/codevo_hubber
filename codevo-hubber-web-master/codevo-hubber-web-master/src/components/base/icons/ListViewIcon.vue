<template>
  <svg
    :class="{ svgClass }"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    :fill="pathColor || '#A6ACB5'"
  >
    <path
      d="M5 5h24a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2zM1 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 9h24a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm-4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 9h24a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm-4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      fill-rule="evenodd"
    />
  </svg>
</template>

<script>
export default {
  name: 'PlusIcon',

  props: {
    pathColor: {
      type: String,
      default: '',
    },
    svgClass: {
      type: String,
      default: '',
    },
  },
}
</script>
