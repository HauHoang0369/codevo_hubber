<script setup>
import IconDocument from '@/assets/icons/icon-detailed-doc@2x.png'
import IconSelectedDocument from '@/assets/icons/components-alert-select@2x.png'
import { onMounted } from 'vue'

const props = defineProps({
  item: Object,
})
</script>

<template>
  <v-card
    class="rounded-xl elevation-4 d-flex flex-row justify-space-between align-center"
    style="height: 125px"
  >
    <div>
      <div
        style="height: 121px; width: 124px"
        class="rounded-e-circle rounded-xl rounded-b-circle"
      >
        <img :src="IconDocument" style="height: 121px; width: 124px" />
      </div>
    </div>
    <div class="d-flex flex-column flex-fill ml-2 pt-4 pb-4">
      <div class="text-xl-h6 font-weight-bold">{{ item.name }}</div>
      <div>{{ item.description }}</div>
    </div>
    <div class="align-self-start pt-4 pr-4 pb-4">I</div>
  </v-card>
</template>
<style scoped></style>
