<script setup>
const props = defineProps({
  text: String,
})
</script>

<template>
  <div class="tag-block">
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.tag-block {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding:0px 10px;
  height: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
}
.tag-block span {
  font-size: 14px;
  font-weight: normal;
  color: var(--primary);
}
</style>
