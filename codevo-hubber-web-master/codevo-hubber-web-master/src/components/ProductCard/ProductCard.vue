<script setup>
import ProductService from '@/services/Product/ProductService'
import FavouriteIcon from '@/components/base/icons/FavouriteIcon.vue'
import ProductVisibilityIcon from '@/components/base/icons/ProductVisibilityIcon.vue'
import EnabledIcon from '@/components/base/icons/SystemEnabledIcon.vue'
import PublicMarketsIcon from '@/components/base/icons/PublicMarketsIcon.vue'
import { computed,onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthImage from '@/components/base/AuthImage/AuthImage'
import LabelApp from '@/components/base/Label/LabelApp'
import { useStore } from 'vuex'
import ProductVisibilityPopup from '@/components/Product/ProductVisibilityPopup'
import PendingIcon from "@/components/base/icons/PendingIcon";
import RejectedIcon from "@/components/base/icons/RejectedIcon";

const router = useRouter()
const store = useStore()
const props = defineProps({
  product: Object,
  isAnonymous: Boolean,
  isGlobal: Boolean
})
const user = computed(() => store.getters.getUser)

const isFavourite = ref(false)
const enabled = ref(false)
const visibleNotPublicMarkets = ref(false)
const showProtectedPopup = ref(false)

onMounted(async () => {
  isFavourite.value = props.product.isFavourite
  enabled.value = props.product.enabled
  visibleNotPublicMarkets.value = props.product.visibleNotPublicMarkets
})

const isPendingProduct = computed(() => props.product.approvalStatus === 'PENDING');
const isRejectedProduct = computed(() => props.product.approvalStatus === 'REJECTED');

const onProductDetails = () => {
  router.push({ name: props.isGlobal ? 'GlobalProduct': 'Product', params: { id: props.product.id }})
}

let favourite = async () => {
  // isFavourite.value = !isFavourite.value;
  try {
    isFavourite.value =
      await new ProductService().service.toggleProductFavourite(
        props.product.id
      )
  } catch (e) {
    console.error(e)
  }
}

let setActive = async () => {
  try {
    let params = {
      productId: props.product.id,
      marketId: user.value.market.id,
      contentLanguage: user.value.contentLanguage.isoCode,
    }
    enabled.value =
      await new ProductService().service.toggleProductEnabled(
        params
      )
      console.log({product: props.product.id},{enabled: enabled.value})
  } catch (e) {
    console.error(e)
  }
}

let setPublicMarkets = async () => {
  try {
    let params = {
      productId: props.product.id,
      marketId: user.value.market.id,
      contentLanguage: user.value.contentLanguage.isoCode,
    }
    visibleNotPublicMarkets.value =
      await new ProductService().service.toggleProductMarketVisibility(
        params
      )
      console.log({product: props.product.id},{visible: visibleNotPublicMarkets.value})
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
        <div class="product-top-image-container d-flex flex-row">
          <AuthImage
            :path="product?.imageUrl"
            :height="169"
            :width="128"
            class="product-image flex-shrink-0"
            :class="enabled?'enabled':'disabled'"
          ></AuthImage>
        </div>
      </div>
      <div
        class="product-top-box product-top-favourite ml-2"
        v-if="!isAnonymous"
      >
        <div class="product-top-star-container">
          <FavouriteIcon
            v-on:click.stop="favourite"
            :isFavourite="isFavourite"
          />
        </div>
        <div class="product-top-star-container">
          <v-tooltip :text="enabled?$t('PRODUCT_DISABLE_TOOLTIP'):$t('PRODUCT_ENABLE_TOOLTIP')">
            <template v-slot:activator="{ props }">
              <EnabledIcon
                v-bind="props"
                :isActive="enabled"
                @click.stop="setActive"
              />
            </template>
          </v-tooltip>
        </div>
        <div v-if="isGlobal" class="product-top-star-container">
          <PublicMarketsIcon
            v-on:click.stop="setPublicMarkets"
            :isVisible="visibleNotPublicMarkets"
          />
        </div>
        <div v-else class="product-top-star-container position-relative">
          <ProductVisibilityIcon
            v-on:click.stop="showProtectedPopup = true"
            :isVisible="visibleNotPublicMarkets"
          />
          <v-tooltip
            activator="parent"
            location="right"
          >
            {{$t('PRODUCT_VISIBILITY_CONFIGURE_PROTECTED_TOOLTIP')}}
          </v-tooltip>
        </div>

        <div v-if="isPendingProduct" class="product-top-star-container position-relative">
          <PendingIcon />
          <v-tooltip
            activator="parent"
            location="right"
          >
            Il prodotto è in attesa di approvazione
          </v-tooltip>
        </div>

        <div v-else-if="isRejectedProduct" class="product-top-star-container position-relative">
          <RejectedIcon />
          <v-tooltip
            activator="parent"
            location="right"
          >
            Il prodotto è stato rifiutato
          </v-tooltip>
        </div>

        <!-- Product visibility popup -->
        <v-dialog
          v-model="showProtectedPopup"
          max-width="534"
          v-on:click:outside="showProtectedPopup = false"
        >
          <v-card style="border-radius: 30px">
            <ProductVisibilityPopup :product='product' v-on:close="showProtectedPopup = false" />
          </v-card>
        </v-dialog>
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
      <div class="pt-3" style="color: var(--grey-dark)">APPLICAZIONE</div>
      <div class="w-100 d-flex flex-wrap">
        <LabelApp
          class="mt-2 mb-2 mr-2 filter-chip"
          v-for="(application, index) in product.applicationList"
          :key="index"
        >
          {{ application?.description }}
        </LabelApp>
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
  margin-bottom: 16px;
}

.product-top-image-container {
  height: 174px;
  width: 100%;
}

.disabled{
  opacity:0.5;
}

.enabled{
  opacity:1;
}
</style>
