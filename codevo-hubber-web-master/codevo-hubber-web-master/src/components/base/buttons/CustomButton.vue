<template>
  <button class="button" :class="classObject">{{ title }}</button>
</template>

<script>
export default {
  props: {
    title: String,
    bgColor: String,
    type: String,
  },
  computed: {
    classObject() {
      return {
        'btn-primary': this.type === 'primary',
      }
    },
  },
}
</script>

<style type="text/css"></style>
