<script setup>
import { computed, ref } from 'vue'
// components
import EditIcon from '@/components/base/icons/EditIcon.vue'
import GlobalProductHighlightPopup from '@/components/Product/GlobalProductHighlightPopup.vue'
import CheckIcon from '@/assets/icons/icon-system-check@2x.png'

const props = defineProps({
  product: Object,
})

const onProductHighlight = ref(false)
const data = computed(() => props.product)
</script>
<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <div class="lingua-title">English</div>
      <div class="icon" @click="onProductHighlight = true">
        <EditIcon pathColor="#A6ACB5" />
      </div>
    </div>

    <div v-if="data?.claim" class="lingua-item-title">{{ data.claim }}</div>
    <ul v-if="data?.highlights" class="lingua-item-list">
      <li
        v-for="(value, index) in data.highlights"
        :key="index"
        class="d-flex align-center"
      >
        <img :src="CheckIcon" alt="Check Icon" class="check-icon mr-2" />
        {{ value }}
      </li>
    </ul>
    <v-dialog
      v-model="onProductHighlight"
      max-width="1161"
      v-on:click:outside="onProductHighlight = false"
    >
      <v-card style="border-radius: 30px">
        <GlobalProductHighlightPopup
          :product="product"
          v-on:close="onProductHighlight = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.lingua-title {
  color: var(--text);
  font-size: 18px;
}

.lingua-item-title {
  margin-top: 30px;
  margin-bottom: 28px;
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  color: var(--primary);
}

.icon {
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);
  cursor: pointer;
}

ul.lingua-item-list {
  li {
    list-style-type: none;
    line-height: 1.44;
    color: var(--text);
    margin-bottom: 23px;

    .check-icon {
      width: 30px;
      height: 32px;
    }
  }
}
</style>
