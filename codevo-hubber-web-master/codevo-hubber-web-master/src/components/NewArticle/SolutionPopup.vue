<script setup>
import IconSolution from '@/assets/icons/icon-system-solutions@2x.png'
import { defineProps } from 'vue'
// eslint-disable-next-line
const props = defineProps({
  item: {
    type: Object,
  },
})
</script>

<template>
  <div class="solution-content">
    <div class="solution-image">
      <img :src="IconSolution" :alt="item.name" />
    </div>
    <div class="solution-info">
      <p class="solution-info-name">{{ item.name }}</p>
      <p class="solution-info-need">{{ item.need }}</p>
    </div>

    <div v-if="item.selected" class="solution-selected">
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
.solution-content {
  display: flex;
  cursor: pointer;
  position: relative;
  width: 344px;
  padding: 10px 0;
  border-bottom: solid 1px var(--grey);
}

.solution-image {
  min-width: 70px;
}

.solution-info {
  margin-left: 12px;
}

.solution-info-name {
  margin-top: 7px;
  font-size: 16px;
  font-weight: bold;
  color: var(--text);
}

.solution-info-need {
  font-size: 14px;
  color: var(--grey-dark);
}

.solution-selected {
  position: absolute;
  width: 23px;
  height: 23px;
  background-image: linear-gradient(to bottom, #009982, var(--primary));
  border-radius: 50%;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.solution-selected svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
