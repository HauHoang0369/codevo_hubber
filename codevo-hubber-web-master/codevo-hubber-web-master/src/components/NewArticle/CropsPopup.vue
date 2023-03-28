<template>
  <div class="crop-container">
    <div class="crop-detail">
      <AuthImage :width="70" :height="70" :path="item.iconImageUrl" />
      <div class="crop-title">
        <h3>{{ item.name }}</h3>
      </div>
    </div>

    <div v-if="item.selected" class="crop-selected">
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

<script setup>
import AuthImage from '@/components/base/AuthImage/AuthImage'
import { defineProps } from 'vue'

defineProps({
  item: {
    type: Object,
  },
})
</script>

<style type="text/css" scoped>
.crop-container {
  display: flex;
  cursor: pointer;
  position: relative;
  width: 344px;
  padding: 10px 0;
  border-bottom: solid 1px var(--grey);
}

.products-search img {
  position: absolute;
  right: 10px;
  top: 40px;
  width: 20px;
}
.crop-container {
  display: flex;
}

.crop-container .crop-detail {
  display: flex;
  align-items: center;
}

.crop-container .crop-detail h3 {
  width: 234px;
  height: 20px;
  margin: 0px;
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.crop-container .crop-detail img {
  border-radius: 10px;
  margin: 0px 10px;
}

.crop-selected {
  position: absolute;
  width: 23px;
  height: 23px;
  background-image: linear-gradient(to bottom, #009982, var(--primary));
  border-radius: 50%;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.crop-selected svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
