<script setup>
import ProductDetailSection from '@/components/Product/ProductDetailSection'
import Grid from '@/components/base/Grid/Grid'
import {onMounted, ref} from "vue";

const props = defineProps({
  ingredients: Array,
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

// const error=ref(null)
//
// onMounted(async () => {
//   if(props.ingredients?.length===0){
//     error.value="
//   }
// })

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
      :loading="loading"
      :error="error"
      v-on:load-more="onLoadMore">
      <template v-slot:title>{{ $t('PRODUCT_DETAIL_INGREDIENTI_TITLE') }}</template>
      <Grid class="ingredients-container" xl="3" lg="3" md="2" sm="1" :column-gap="40" :row-gap="30">
        <div class="ingredient-item" v-for="(ingredient, index) in ingredients" :key="index">
          <div class="ingredient-item-title" v-capitalise>{{ ingredient?.name }}</div>
          <div class="ingredient-item-description" v-capitalise>{{ ingredient?.objective }}</div>
        </div>
      </Grid>
    </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>


<style lang="scss" scoped>
.ingredients-container {
  margin-top: 30px;
}


.ingredient-item {
  padding: 20px 20px 9px;
  border-radius: 10px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  min-height: 100px;
  max-width: content-box;
}

.ingredient-item-title {
  margin: 0 0 10px;
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.ingredient-item-description {
  margin: 10px 0 0;
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: var(--text);
}

</style>
