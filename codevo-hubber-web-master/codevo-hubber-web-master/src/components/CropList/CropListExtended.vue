<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import CropListExtendedCard from '@/components/CropList/CropListExtendedCard'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps({
  crops: Array,
})

const view = ref(0)

const onNext = () => {
  console.log('onNext')
  view.value += 1
}

const onPrev = () => {
  console.log('onPrev')
  view.value -= 1
}

const page = computed({
  get() {
    return crops / 3
  },
})

const totalPages = computed({
  get() {
    return documents.value.length - viewCount.value
  },
})
</script>

<template>
  <div class="pt-6 pb-12">
    <v-slide-group class="pt-4 pb-4" active-class="success" show-arrows>
      <template v-slot:prev>
        <img
          :src="require('@/assets/icons/icon-system-chevron-left@2x.png')"
          class=""
          style="height: 30px; width: 30px"
          @click="onPrev"
        />
      </template>
      <template v-slot:next>
        <img
          :src="require('@/assets/icons/icon-system-chevron-right@2x.png')"
          class=""
          style="height: 30px; width: 30px"
          @click="onNext"
        />
      </template>

      <div
        v-for="(item, index) in crops"
        :key="index"
        style="width: 500px"
        class="mr-8 mt-4 mb-5 ml-2"
      >
        <CropListExtendedCard :item="item"></CropListExtendedCard>
      </div>
    </v-slide-group>
  </div>
</template>

<style type="text/css">
.v-slide-group__next--disabled,
.v-slide-group__prev--disabled {
  display: none;
}
</style>
