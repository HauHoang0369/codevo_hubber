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
      d="M4 4v3a1 1 0 0 0 .883.993L5 8h2a1 1 0 0 0 1-1V4h5v3a1 1 0 0 0 .883.993L14 8h2a1 1 0 0 0 1-1V4h5v3a1 1 0 0 0 .883.993L23 8h2a1 1 0 0 0 1-1V4h1a3 3 0 0 1 3 3v2.69H0V7a3 3 0 0 1 3-3h1zm2-3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1zm9 0a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1zm9 0a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1zm6 10v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V11h30zm-2 2H2v13a1 1 0 0 0 .883.993L3 27h24a1 1 0 0 0 .993-.883L28 26V13z"
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
