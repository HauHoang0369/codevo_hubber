<script>
export default {
  name: 'ProductIcon',

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
    <svg :class="{ svgClass }" width="20" height="20" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <path
      d="M22.173 26.734v1.082a3 3 0 0 1-3 3h-8.11a3 3 0 0 1-3-3v-1.082h14.11zm0-13.265v12.245H8.063V13.47h14.11zM17.143.204a1 1 0 0 1 1 1v4.123a1 1 0 0 1-1 1h-.97a6 6 0 0 1 6 6v.121H8.063v-.121a6 6 0 0 1 6-6h-.968a1 1 0 0 1-1-1V1.204a1 1 0 0 1 1-1h4.047z"
      :fill="pathColor || '#A6ACB5'" fill-rule="evenodd"/>
    </svg>
</template>
