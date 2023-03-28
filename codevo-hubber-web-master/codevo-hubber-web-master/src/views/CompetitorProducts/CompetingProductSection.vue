<script setup>
import ProductDetailSection from '@/components/Product/ProductDetailSection'
import Grid from '@/components/base/Grid/Grid'
import ProductCard from '@/components/ProductCard/ProductCard.vue'

defineProps({
  products: Array,
  more: Number,
  showMore: Boolean,
  loading: Boolean,
  error: String,
  divider: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['loadMore'])
const onLoadMore = () => {
  emit('loadMore')
}
</script>

<template>
  <div>
    <ProductDetailSection
      load-more-label="Mostra altri1"
      :more="more"
      :show-more="showMore"
      :no-data="products?.length === 0"
      :loading="loading"
      :fetch-error="error"
      v-on:load-more="onLoadMore"
    >
      <template #title>Prodotti in competizione</template>
      <Grid
        class="competing-products-container"
        xl="3"
        lg="2"
        md="1"
        sm="1"
        :column-gap="40"
        :row-gap="30"
      >
        <ProductCard
          v-for="product in products"
          :product="product"
          :key="product.id"
        />
      </Grid>
    </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>

<style lang="scss" scoped>
.competing-products-container {
  margin-top: 30px;
}
</style>
