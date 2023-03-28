<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'

const props = defineProps({
  product: Object,
  selected: Boolean,
});

const emit = defineEmits(['toggleSelect'])

const toggleSelect = () => {
  emit('toggleSelect', props.product)
};
</script>

<template>
  <div
    class="list-item mb-3 pa-3 d-flex flex-row justify-space-between align-center"
    @click.prevent="toggleSelect"
  >
    <div class="d-flex flex-column align-start pl-4 pr-4">
      <div
        class="font-white type-chip"
        :style="{ 'background-color': product.productFamily?.color }"
      >
        {{ product.productFamily?.code }}
      </div>
      <div class="product-name mt-2 text-clamp-2">{{ product.name }}</div>
    </div>
    <div class="position-relative">
      <div class="product-image mr-5">
        <AuthImage :path="product.imageUrl" width="70" height="87"></AuthImage>
      </div>
      <div
        class="position-absolute rounded-circle product-select-check"
        v-if="selected"
      >
        <img :src="CheckIcon" class="fill-height" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  height: 110px;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
}

.text-dark {
  color: $color-text;
}

.type-chip {
  display: flex;
  align-items: center;
  padding: 0 22px;
  border-radius: 13.5px;
  background-color: var(--p-bs);
  color: white;
  height: 27px;
  font-size: 14px;
}

.product-select-check {
  top: 0;
  right: 0;
  height: 23px;
  width: 23px;
  margin: 0 0 1px;
  background-image: linear-gradient(to bottom, #009982, #00604b);
}

.product-image {
  height: 87px;
  width: auto;
  min-width: 70px;
}

.product-name {
  font-size: 18px;
  color: $color-text;
  font-weight: bold;
  text-align: left;
}
</style>
