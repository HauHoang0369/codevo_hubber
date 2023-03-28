<script>
export default {
  name: 'CommentIcon',

  props: {
    pathColor: {
      type: String,
      default: 'currentColor',
    }
  }
}
</script>
<template>
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2c8.284 0 15 4.925 15 11 0 3.873-2.73 7.279-6.855 9.239-.021.07-.045.144-.07.22-1.73 5.056-6.639 8.666-5.84 6.015.532-1.767-.592-3.274-3.372-4.52l.038.017C6.13 23.558 0 18.804 0 13 0 6.925 6.716 2 15 2z"
      fill-rule="evenodd"
      :fill='pathColor'
    />
  </svg>
</template>
