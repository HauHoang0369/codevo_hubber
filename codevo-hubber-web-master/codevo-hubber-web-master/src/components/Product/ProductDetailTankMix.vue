<script setup>
// import { capitalize, computed, h } from 'vue';

import ProductDetailSection from '@/components/Product/ProductDetailSection'
import Grid from '@/components/base/Grid/Grid'
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
    tankMixes: Array,
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
  <div class="tankmixes-section">
    <ProductDetailSection
          v-if="!isAnonymous"
          load-more-label="Guarda altri"
          :more="tankMixesLoadMore"
          :show-more="tankMixesLoadMore>0"
          :loading="tankMixesLoading"
          :error="tankMixesError"
          v-on:load-more="onMoreTankMixes">
          <template v-slot:topIcon>
            <img src="@/assets/icons/icon-detailed-tankmix.png"
                 srcset="@/assets/icons/icon-detailed-tankmix@2x.png 2x,
             @/assets/icons/icon-detailed-tankmix@3x.png 3x"
                 class="Icondetailedtankmix">
          </template>
          <template v-slot:title>Tank Mix</template>
          <template v-slot:description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh
            finibus et. Aenean eu enim justo.
          </template>
          <div class="">
            <div>COMBINAZIONI SICURE</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['FEASIBLE'].mixes" :key="index" type="feasible">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="feasible"
                                 v-if="(tankMixes['FEASIBLE'].envelope?.totalElements - tankMixes['FEASIBLE'].mixes?.length)>0">
                  + {{ tankMixes['FEASIBLE'].envelope?.totalElements - tankMixes['FEASIBLE'].mixes?.length }}
                </LabelIngredient>
              </div>
            </div>

            <div>DA MISCELARE CON CAUTELA</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['NOT_FEASIBLE'].mixes" :key="index"
                                 type="not-feasible">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="not-feasible"
                                 v-if="(tankMixes['NOT_FEASIBLE'].envelope?.totalElements - tankMixes['NOT_FEASIBLE'].mixes?.length)>0">
                  + {{ tankMixes['NOT_FEASIBLE'].envelope?.totalElements - tankMixes['NOT_FEASIBLE'].mixes?.length }}
                </LabelIngredient>
              </div>
            </div>

            <div>ATTENZIONE! NON COMPATIBILE</div>
            <div class="tankmixes-container w-100">
              <Grid xl="7" lg="4" md="2" sm="1" :column-gap="20" :row-gap="20"
                    class="">
                <LabelIngredient v-for="(mix, index) in tankMixes['FEASIBLE_WITH_CAUTION'].mixes" :key="index"
                                 type="feasible-with-caution">
                  {{ mix?.name }}
                </LabelIngredient>
              </Grid>
              <div class="align-self-end" style="width: fit-content">
                <LabelIngredient type="feasible-with-caution"
                                 v-if="(tankMixes['FEASIBLE_WITH_CAUTION'].envelope?.totalElements - tankMixes['FEASIBLE_WITH_CAUTION'].mixes?.length)>0">
                  + {{
                    tankMixes['FEASIBLE_WITH_CAUTION'].envelope?.totalElements - tankMixes['FEASIBLE_WITH_CAUTION'].mixes?.length
                  }}
                </LabelIngredient>
              </div>
            </div>

          </div>
        </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>


<style lang="scss" scoped>

.tankmixes-section {
  background-color: var(--background-blue);
}

.tankmixes-container {
  margin-bottom: 59px;
  margin-top: 22px;
  display: grid;
  grid-template-columns: 7fr 1fr;
  grid-column-gap: 20px;
}

.fixed{box-shadow:none !important;}
</style>
