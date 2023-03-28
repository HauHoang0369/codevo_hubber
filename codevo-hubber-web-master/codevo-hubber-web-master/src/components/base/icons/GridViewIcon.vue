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
      d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 14h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM18 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 14h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
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
