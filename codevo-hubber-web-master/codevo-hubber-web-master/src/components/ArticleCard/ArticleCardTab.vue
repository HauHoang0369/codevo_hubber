<script setup>
const props = defineProps({
  text: String,
})
</script>

<template>
  <button>
    {{ text }}
  </button>
</template>

<style type="text/css" scoped>
button {
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 7px 10px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}
</style>
