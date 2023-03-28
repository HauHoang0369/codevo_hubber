<template>
  <div class="product-related">
    <div class="product-related-title">Ti consigliamo anche</div>
    <div class="product-related-container">
      <product-related-add @click="showPopup = true" />
      <!--      <product-related-card />-->
      <!--      <product-related-card />-->
    </div>

    <v-dialog
      v-model="showPopup"
      max-width="534"
      @click:outside="showPopup = false"
    >
      <v-card style="border-radius: 30px">
        <product-related-popup
          v-if="showPopup"
          @close="showPopup = false"
          multi-select
          :selected-products="relatedProducts"
          :selected-product-family="productFamily"
          @confirm="onConfirm"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import ProductRelatedAdd from '@/components/Product/Local/ProductRelatedAdd.vue'
import ProductRelatedCard from '@/components/Product/Local/ProductRelatedCard.vue'
import { ref } from 'vue'
import ProductRelatedPopup from '@/components/Product/Local/ProductRelatedPopup.vue'

const showPopup = ref(false)
const relatedProducts = ref([])
const productFamily = ref(null)
const onConfirm = ({ family, products }) => {
  productFamily.value = family
  relatedProducts.value = [...products]
}
</script>

<style lang="scss">
.product-related {
  &-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }

  &-title {
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: var(--primary);
    margin-top: 40px;
    margin-bottom: 30px;
  }
}
</style>
