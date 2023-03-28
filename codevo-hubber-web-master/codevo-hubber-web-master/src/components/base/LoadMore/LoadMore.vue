<script setup>
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'

const props = defineProps({
  more: Number,
  showMore: Boolean,
  loading: Boolean,
  error: String,
  label: String,
  align: {
    type: String,
    default: 'center'
  },
})

const emit = defineEmits(['showMore'])

const onLoadMore = () => {
  emit('showMore')
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="mt-8" v-if="showMore && !loading"
         :style="{'align-self':align}"
    >
      <ButtonPrimaryDesktop @click="onLoadMore"
                            :bg-style="{'background-color': 'linear-gradient(to top, #f9c86c, #f0973a)'}"
                            class="button">
        <span class="button-label">{{ label }} {{ more }}</span>
      </ButtonPrimaryDesktop>
    </div>
    <div class="mt-10 d-flex justify-center w-100" v-else-if="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.button {
  background-color: var(--white);
}

.button-label {
  color: var(--primary) !important;
}


</style>
