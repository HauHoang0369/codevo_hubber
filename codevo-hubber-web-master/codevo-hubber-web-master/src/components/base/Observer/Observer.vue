<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const emit = defineEmits(['intersect'])
const props = defineProps({
  options: null
})

let observer = reactive({})
const root = ref(null)

onMounted(async () => {
  const options = props.options || {}
  observer = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit('intersect')
    }
  }, options)

  observer.observe(root.value)
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <div ref='root' class='observer'></div>
</template>
