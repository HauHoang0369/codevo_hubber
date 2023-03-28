<script>
export default {
  name: 'EditIcon',
  props: {
    pathColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m3.364 18.542-1.516.372.371-1.516 1.145 1.144zm2.856-.7-2.1.515-1.715-1.716.515-2.099 3.3 3.3zM16.226 2.18 3.97 14.435l-.472-.471L15.755 1.707l.471.472zm2.829 2.828L6.798 17.264l-.471-.472L18.583 4.536l.472.471zm-.943-.943L5.855 16.321l-1.414-1.414L16.698 2.65l1.414 1.414zm0-2.828 1.414 1.414c.52.52.52 1.365 0 1.886l-3.3-3.3c.521-.52 1.365-.52 1.886 0z"
      :fill="pathColor || 'currentColor'" fill-rule="evenodd" />
  </svg>
</template>
