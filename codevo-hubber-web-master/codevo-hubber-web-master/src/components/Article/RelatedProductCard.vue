<script setup>
import ProductService from '@/services/Product/ProductService'
import FavouriteIcon from '@/components/base/icons/FavouriteIcon.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Chip from '@/components/base/buttons/Chip'
import AuthImage from '@/components/base/AuthImage/AuthImage'

const router = useRouter()
const props = defineProps({
  product: Object,
  // isAnonymous: Boolean,
})

const isFavourite = ref(false)

onMounted(async () => {
  isFavourite.value = props.product.isFavourite
})

const onProductDetails = () => {
  router.push({ name: 'Product', params: { id: props.product.id } })
}

let favourite = async () => {
  // isFavourite.value = !isFavourite.value;
  try {
    isFavourite.value = await new ProductService().service.toggleFavourite(
      props.product.id
    )
  } catch (e) {
    console.error(e)
  }
}
</script>
<template>
  <div
    class="product-card mx-auto w-100 d-flex flex-column"
    v-on:click="onProductDetails"
  >
    <div class="d-flex flex-row justify-space-between">
      <div class="flex-grow-1 d-flex flex-column justify-space-between">
        <div>
          <div class="">
            <v-chip
              class="my-1 product-tag product-tag-rosso"
              size="small"
              v-if="product.newProduct"
            >
              Novita
            </v-chip>
          </div>
          <div>
            <v-chip
              size="small"
              class="product-tag product-tag-green"
              v-if="product.certificate"
            >
              {{ product.certificate }}
            </v-chip>
          </div>
        </div>
        <div class="py-0">
          <v-chip
            size="small"
            class="product-tag product-tag-red"
            :style="{ backgroundColor: product.productFamily.color }"
            v-if="product.productFamily"
          >
            {{ product.productFamily.code }}
          </v-chip>
        </div>
      </div>
      <div class="product-image">
        <div class="product-top-image-container">
          <AuthImage
            :path="product?.imageUrl"
            :height="169"
            :width="128"
          ></AuthImage>
        </div>
      </div>
      <div class="product-top-box product-top-favourite ml-2">
        <div class="product-top-star-container">
          <FavouriteIcon
            v-on:click.stop="favourite"
            :isFavourite="isFavourite"
          />
        </div>
      </div>
    </div>

    <div class="py-0 mt-2 Titolo-card-M">
      {{ product.name }}
    </div>
    <div class="product-claim -light-left-dark">
      {{ props.product?.claim }}
    </div>
    <!--    <div class="flex-grow-1">-->
    <!--    </div>-->
    <div class="mx-1">
      <v-divider></v-divider>
      <div class="pt-3" style="color: var(--grey-dark); font-size: 14px">
        APPLICAZIONE
      </div>
      <div class="w-100 d-flex flex-wrap">
        <Chip
          class="mt-2 mb-2 mr-2 filter-chip"
          font="normal-14"
          v-for="(application, index) in product.applicationList"
          :key="index"
        >
          {{ application.description }}
        </Chip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  cursor: pointer;
  padding: 20px 24.3px 18px 19.7px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(192, 210, 247, 0.3);
  border: solid 1px rgba(221, 233, 255, 0.27);
  background-color: var(--white);
}

.product-image {
  width: 132.6px;
  height: 174.2px;
}

.product-tag {
  font-size: 10px;
}

.product-tag-rosso {
  background-color: rgb(var(--v-theme-rosso));
  color: var(--white);
}

.product-tag-red {
  background-color: rgb(var(--v-theme-p-bs));
  color: var(--white);
}

.product-tag-green {
  background-color: rgb(var(--v-theme-verde-acqua));
  color: var(--white);
}

.product-action-button {
  background-color: var(--rosso);
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
}

.product-button-text {
  color: var(--primary);
}

.product-claim {
  margin-top: 9px;
  margin-bottom: 29px;
  font-size: 16px;
  /*height: 100px;*/
  text-overflow: ellipsis;
  overflow: hidden;
  /*Addition lines for 2 line or multiline ellipsis*/
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.filter-chip {
  color: var(--primary);
}

.product-top-star-container {
  height: 30px;
  width: 30px;
}

.product-top-image-container {
  height: 174px;
}

.Titolo-card-M {
  font-size: 18px;
}

@media (max-width: 530px) {
  .product-card > .d-flex {
    display: block;
  }
}
</style>
