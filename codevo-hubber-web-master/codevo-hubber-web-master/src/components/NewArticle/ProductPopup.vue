<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import { defineProps } from 'vue'
// eslint-disable-next-line
const props = defineProps({
  item: {
    type: Object,
  },
})
</script>

<template>
  <div class="product-content">
    <div class="product-image">
      <auth-image :path="item.imageUrl" :width="74" :height="74" />
    </div>
    <div class="product-info">
      <div
        class="product-info-acronym"
        :style="{ background: item.productFamily.color }"
      >
        {{ item.productFamily.code }}
      </div>
      <p class="product-info-name">{{ item.name }}</p>
    </div>

    <div v-if="item.selected" class="product-selected">
      <svg
        width="24"
        height="23"
        viewBox="0 0 24 23"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.667 5.31c.606.591.617 1.562.025 2.168l-9.334 9.558a1.533 1.533 0 0 1-2.07.113l-.099-.088-4.254-4.16a1.533 1.533 0 0 1 2.143-2.192l3.157 3.086 8.263-8.46a1.533 1.533 0 0 1 2.169-.026z"
          fill="#FFF"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<style type="text/css" scoped>
.product-content {
  display: flex;
  cursor: pointer;
  position: relative;
  width: 344px;
  padding: 10px 0;
  border-bottom: solid 1px var(--grey);
}

.product-image {
  width: 47px;
}

.product-info-acronym {
  font-size: 14px;
  font-weight: 500;
  color: var(--white);
  display: inline-block;
  padding: 0 15px;
  border-radius: 13.5px;
}

.product-info {
  margin-left: 12px;
}

.product-info-name {
  margin-top: 7px;
  font-size: 16px;
  font-weight: bold;
  color: var(--text);
}

.product-selected {
  position: absolute;
  width: 23px;
  height: 23px;
  background-image: linear-gradient(to bottom, #009982, var(--primary));
  border-radius: 50%;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.product-selected svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
