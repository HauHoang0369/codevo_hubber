<script setup>
// import { capitalize, computed, h } from 'vue';

import ProductDetailSection from '@/components/Product/ProductDetailSection'
import Grid from '@/components/base/Grid/Grid'
import ProductCard from "@/components/ProductCard/ProductCard.vue";
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  products: Array,
  more: Number,
  showMore: Boolean,
  loading: Boolean,
  error: String,
  divider: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['loadMore'])
const onLoadMore = () => {
  console.log("More")
  emit('loadMore');
}

const onProductDetails = (product) => {
  router.push('/products/' + product?.id)
}


// Custom directive: Capitalise
const vCapitalise = {
  mounted: (el, binding, vnode, prevVnode) => {
    let value = el.innerHTML.toLowerCase()
    el.innerHTML = value.charAt(0).toUpperCase() + value.slice(1)
  }
}

</script>
<template>
  <div>
    <ProductDetailSection
      load-more-label="Mostra altri1"
      :more="more"
      :show-more="showMore"
      :no-data="products?.length===0"
      :loading="loading" :fetch-error="error" v-on:load-more="onLoadMore">
      <template v-slot:title>Prodotti correlati</template>
      <Grid class="samelineproducts-container" xl="3" lg="2" md="1" sm="1" :column-gap="40" :row-gap="30">
        <ProductCard
          v-for="(product, index) in products"
          :product="product"
          :key="product.id"
          v-on:click="onProductDetails(product)"
        />
      </Grid>
    </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>


<style lang="scss" scoped>
.samelineproducts-container {
  margin-top: 30px;
}
</style>
