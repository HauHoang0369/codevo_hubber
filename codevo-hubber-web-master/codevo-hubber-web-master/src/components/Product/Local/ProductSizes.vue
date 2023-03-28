<template>
  <div class="product-format-popup">
    <div class="add-application">
      <div
        class="d-flex align-center font-weight-medium add-application-btn"
        @click="showPopup = true"
      >
        <PlusIcon class="mr-2" path-color="currentColor" />
        {{ $t('PRODUCT_ADD_SIZE_TITLE') }}
      </div>
      <div class="d-flex mt-3 product-sizes">
        <swiper
          :slides-per-view="5"
          :css-mode="true"
          :navigation="true"
          :modules="modules"
          class="product-sizes-slide"
        >
          <swiper-slide v-for="item in productSizes" :key="item.id">
            <div class="d-flex flex-column align-center justify-center">
              <div class="product-size">
                <auth-image :path="item.imageUrl" />
              </div>
              <span class="chip-label">{{ item.description }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <v-dialog
      v-model="showPopup"
      max-width="534"
      v-on:click:outside="showPopup = false"
    >
      <v-card style="border-radius: 30px">
        <ProductSizesPopup @close="showPopup = false" />
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import PlusIcon from '@/components/base/icons/PlusIcon.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ProductSizesPopup from '@/components/Product/Local/ProductSizesPopup.vue'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'

const store = useStore()
const showPopup = ref(false)
const productSizes = computed(
  () => store.state.products.currentProduct?.productSizes || []
)

// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/scss'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation } from 'swiper'
const modules = ref([Navigation])
</script>

<style lang="scss">
.product-format-popup {
  .add-application {
    .add-application-btn {
      height: 48px;
      cursor: pointer;
    }

    .product-sizes {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;

      &-slide {
        width: 400px;

        .swiper-button-disabled {
          display: none;
        }
      }

      .product-size {
        width: 26px;
        height: 26px;
      }

      .chip-label {
        font-size: 14px;
        padding: 7px 10px;
        color: var(--text);
        font-weight: bold;
      }
    }
  }
}
</style>
