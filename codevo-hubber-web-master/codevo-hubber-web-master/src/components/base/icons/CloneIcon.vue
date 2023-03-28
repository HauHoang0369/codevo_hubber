<script>
export default {
  name: 'CloneIcon',
  props: {
    pathColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <g :fill="pathColor || 'currentColor'" fill-rule="evenodd">
      <path d="M21.704 0a1 1 0 0 1 1 1v3H12.419a1 1 0 0 0-.645.236l-.086.082-4.881 5.227a1 1 0 0 0-.27.683V25h-2a1 1 0 0 1-1-1V6.228a1 1 0 0 1 .27-.683L8.688.318A1 1 0 0 1 9.42 0h12.285z"/>
      <path d="M7.538 29V11.228a1 1 0 0 1 .269-.683l4.881-5.227A1 1 0 0 1 13.42 5h12.285a1 1 0 0 1 1 1v23a1 1 0 0 1-1 1H8.538a1 1 0 0 1-1-1z"/>
    </g>
  </svg>

</template>
