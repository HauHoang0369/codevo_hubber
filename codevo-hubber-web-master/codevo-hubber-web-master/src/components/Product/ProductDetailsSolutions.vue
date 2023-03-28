<script setup>
// import { capitalize, computed, h } from 'vue';

import ProductDetailSection from '@/components/Product/ProductDetailSection'
import Grid from '@/components/base/Grid/Grid'
import AuthImage from "@/components/base/AuthImage/AuthImage"
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  solutions: Array,
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

const onSolutionDetails = (solution) => {
  router.push('/solutions/' + solution?.id)
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
      :no-data="solutions?.length===0"
      :loading="loading" :fetch-error="error" v-on:load-more="onLoadMore">
      <template v-slot:title>Soluzioni</template>
      <Grid class="solutions-container" xl="3" lg="2" md="2" sm="1" :column-gap="40" :row-gap="30">
          <div class="solution-item" v-for="(solution, index) in solutions" :key="index" v-on:click="onSolutionDetails(solution)">
            <div class="d-flex flex-row h-100 align-center">
              <AuthImage :path="solution?.crop?.backgroundImageUrl" class="solution-item-image"></AuthImage>
              <div class="ml-5 d-flex flex-column justify-center h-100 solution-item-content">
                <div class="solution-item-title" v-capitalise>{{ solution?.crop?.name }}</div>
                <div class="solution-item-description" v-capitalise>{{ solution?.need }}</div>
              </div>
            </div>
        </div>
      </Grid>
    </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>


<style lang="scss" scoped>
.solutions-container {
  margin-top: 30px;
}

.solution-item {
  /*padding: 20px 20px 9px;*/
  border-radius: 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  height: 121px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

.solution-item-content{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.solution-item-image {
  border-radius: 20px 50% 50% 20px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
  /*height: 100%;*/
  /*width: initial !important;*/
  overflow: hidden;
  width: 124px;
  height: 121px;
  object-fit: contain;
  flex-shrink: 0;
}

.solution-item-title {
  font-family: Ubuntu;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.solution-item-description {
  font-family: Ubuntu;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  //line-height: 1.5;
  letter-spacing: normal;
  color: var(--text);
  margin-top: 10px;
  display: block;/* or inline-block */
  text-overflow: ellipsis;
  word-wrap: break-word;
  //white-space: nowrap;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
}
</style>
