<script setup>
import AuthImage from "@/components/base/AuthImage/AuthImage.vue";
import LabelAdv from "@/components/base/Label/LabelAdv.vue";
import FavouriteIcon from "@/components/base/icons/FavouriteIcon.vue";
import LabelProd from "@/components/base/Label/LabelProd.vue";
import Carousel from "@/components/base/Carousel/Carousel.vue";
import ProductService from "@/services/Product/ProductService";
import DropdownActions from "@/components/Product/DropdownProductAction";
import {computed} from "vue";
import {useDisplay} from "vuetify";

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl']; // no xs

const emit = defineEmits(['favourite'])

const props = defineProps({
  product: Object,
  productSizes: [],
})

const favourite = async () => {
  emit('favourite')
}

const display = useDisplay()
const currentBreakPoint = display?.name

const style = computed({
  get() {
    let templateColumns = "225px 1fr"
    let columnGap = "77"
    let rowGap = 0
    let gridTemplateAreas = '"a b c"  "a d d"';
    if (currentBreakPoint.value === 'xxl' || currentBreakPoint.value === 'xl' || currentBreakPoint.value === 'lg') {
      templateColumns = "225px 1fr"
      columnGap = "77"
      rowGap = 0
      gridTemplateAreas = '"a b c"  "a d d"';
    } else if (currentBreakPoint.value === 'md' || currentBreakPoint.value === 'sm') {
      templateColumns = "1fr"
      rowGap = 20
      gridTemplateAreas = '"c" "b" "a" "d"';
    }
    return {
      '--grid-template-columns': templateColumns,
      "--column-gap": columnGap + "px",
      "--row-gap": rowGap + "px",
      "--grid-template-areas": gridTemplateAreas,

    }
  },
})

</script>
<template>

<div class="product-details-container" :style="style">
    <div class="d-flex product-image-section">
      <AuthImage :path="product.imageUrl"
                 v-if="product.imageUrl!==undefined"
                 :height=305
                 :width=225
                 class="product-image flex-shrink-0"
      ></AuthImage>
    </div>
    <div class="product-action-section d-flex flex-column justify-start align-self-start flex-row-reverse">
      <div class="d-flex flex-row justify-space-between">
        <div class='icon-system-dropdown d-flex align-center'>
          <div class="favourite-icon" style="width: 40px; height: 40px;">
            <FavouriteIcon @click="favourite" :isFavourite="product.isFavourite"></FavouriteIcon> 
          </div>
          <div class="dialog-menu">
            <DropdownActions :product="product"></DropdownActions>
          </div>  
        </div>
      </div>
    </div>
    <div class="product-details-section d-flex flex-column justify-start align-self-start">
      <div class="d-flex flex-row justify-space-between">
        <div class="product-tags d-flex flex-row">
          <LabelAdv class="product-tag-rosso mr-5" v-if="product.newProduct">Novità</LabelAdv>
          <LabelAdv class="product-tag-green mr-5"
                    v-if="product.certificate">{{ product.certificate }}
          </LabelAdv>
        </div>
      </div>
      <div class="product-details-section-name d-flex flex-row align-center">
        <div>
          <LabelProd :style="{'background-color':product.productFamily?.color}">
            {{ product.productFamily?.code }}
          </LabelProd>
        </div>
        <div class="product-name ml-5">
          {{ product.name }}
        </div>
      </div>
    </div>
    <div class="product-carousel-section">
      <Carousel :data="productSizes" :height="26" :width="26"></Carousel>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.product-details-container {
  display: grid;
  grid-template-columns: var(--grid-template-columns);
  column-gap: var(--column-gap);
  row-gap: var(--row-gap);
  grid-template-areas: var(--grid-template-areas);
  padding: 26px 0 25px 57px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.dialog-menu{
  margin-right: 20px;
}

.product-image-section{
  grid-area: a;
}

.product-action-section{
  grid-area: c;
}

.product-carousel-section{
  grid-area: d;
  padding-top: 30px;
  min-width: 0;
}

.product-image {
  width: 225px;
  height: 305px;
  padding:0;
}

.product-details-section {
  padding-top: 10px;
  min-width: 0;
  grid-area: b;
}

.product-tag {
  font-size: 10px;
}

.product-tag-rosso {
  background-color: rgb(var(--v-theme-rosso));
  color: #ffffff;
}

.product-tag-red {
  background-color: rgb(var(--v-theme-p-bs));
  color: #ffffff;
}

.product-tag-green {
  background-color: rgb(var(--v-theme-verde-acqua));
  color: #ffffff;
}

.product-details-section-name {
  margin-top: 39px;
}

.product-name {
  font-family: Ubuntu;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.favourite-icon {
  margin-right: 40px;
}

</style>
