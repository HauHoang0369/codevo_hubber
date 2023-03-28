<script>
export default {
  name: 'PictureIcon',

  props: {
    pathColor: {
      type: String,
      default: '',
    },
    svgClass: {
      type: String,
      default: ''
    }
  }
}
</script>
<template>
  <svg
    :class="{ svgClass }"
    class='svg-icon'
    @click="chooseImage"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28 8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h26zm-12.5 2a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 1a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm-11-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4 5h5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2z"
      :fill="pathColor || '#A6ACB5'"
      fill-rule="evenodd"
    />
  </svg>
</template>
