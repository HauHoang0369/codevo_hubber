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
      d="M19.595 16.593C23.375 17.62 26 19.879 26 22.5c0 3.59-4.925 6.5-11 6.5S4 26.09 4 22.5c0-2.62 2.625-4.879 6.405-5.907C11.611 18.087 13.225 19 15 19c1.758 0 3.36-.897 4.561-2.366l.034-.041zM15 2c3.314 0 6 3.582 6 8s-2.686 8-6 8-6-3.582-6-8 2.686-8 6-8z"
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
