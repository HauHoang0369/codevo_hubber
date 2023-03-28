<script setup>
// https://github.com/vuetifyjs/vuetify/issues/15187
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: Array,
})

const emit = defineEmits(['tabchange'])

const selected = ref('')

onMounted(() => {
  selected.value = props.items.find((x) => x !== undefined) // <div>
})

function onTabSelect(item) {
  console.log('Tab Select: ' + item)
  emit('tabchange')
}
</script>

<template>
  <div
    class="bg-white w-100 pt-2 pb-2 pl-5 pr-5"
    style="height: 64px; border-radius: 32px"
  >
    <v-chip-group v-model="selected" center-active mandatory light>
      <v-chip
        v-for="(item, index) in items"
        :key="index"
        :value="item"
        @click="onTabSelect(item)"
      >
        {{ item }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
