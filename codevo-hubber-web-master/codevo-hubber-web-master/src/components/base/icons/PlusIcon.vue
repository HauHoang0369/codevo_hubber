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
<template>
  <svg
    :class="{ svgClass }"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    :fill="pathColor || 'currentColor'"
  >
    <path
      d="M10 .667c.515 0 .933.418.933.933v7.466H18.4a.933.933 0 1 1 0 1.867h-7.467V18.4a.933.933 0 1 1-1.866 0l-.001-7.467H1.6a.933.933 0 1 1 0-1.866l7.466-.001V1.6c0-.515.419-.933.934-.933z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
</template>
