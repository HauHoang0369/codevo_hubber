<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
// components
import EditIcon from '@/components/base/icons/EditIcon.vue'
import PlusIcon from '@/components/base/icons/PlusIcon.vue'
import Chip from '@/components/base/buttons/Chip.vue'
import DocumentPopup from '@/components/Product/DocumentPopup'
import Grid from '@/components/base/Grid/Grid'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import GlobalProductApplicationPopup from '@/components/Product/GlobalProductApplicationPopup.vue'
import BaseSelect from '@/components/base/inputs/BaseSelect.vue'
import ProductService from '@/services/Product/ProductService'

const store = useStore()

const props = defineProps({
  product: Object,
})

const productName = computed({
  get() {
    return props.product?.name
  },
  set(value) {
    store.commit('products/updateCurrentProduct', { name: value })
  },
})

const familyProducts = ref([])
const technologies = ref([])
const productVisibility = ref(false)
const onProductImage = ref(false)
const onProductApplication = ref(false)
const familyProductLabel = ref('')
const productFamilyValue = computed({
  get() {
    return props.product?.productFamily?.id
  },
  set(value) {
    const data = familyProducts.value.find((item) => item.id === value)
    familyProductLabel.value = `${data.name} (${data.code})`
    store.commit('products/updateCurrentProduct', { productFamily: data })
  },
})
const technology = computed({
  get() {
    return props.product?.technology?.id
  },
  set(value) {
    const data = technologies.value.find((item) => item.id === value)
    store.commit('products/updateCurrentProduct', { technology: data })
  },
})

onMounted(async () => {
  store.commit('setLoading', true)

  familyProducts.value = await new ProductService().getFamilyProducts(0, true)
  technologies.value = await new ProductService().getTechnologies(0, true)

  setDefaultProductFamily()

  store.commit('setLoading', false)
})

const setDefaultProductFamily = () => {
  if (productFamilyValue.value) return

  productFamilyValue.value = 57
}

const setProductVisibility = () => {
  store.commit('products/updateCurrentProduct', {
    visibility: productVisibility.value,
  })
}

const componentKey = ref(0)
const forceRerender = () => {
  componentKey.value += 1
}
</script>

<template>
  <div class="product-detail-container">
    <v-row no-gutters>
      <v-col class="d-flex justify-center align-center" md="4">
        <div class="product-image position-relative">
          <AuthImage
            v-if="product?.imageUrl"
            :key="componentKey"
            :height="200"
            :path="product?.imageUrl"
            :width="200"
          />
          <img
            v-else
            :src="
              product?.productImage?.isNewUpload
                ? product?.productImage?.imageFile
                : '/images/img-product-actiwave.png'
            "
            alt="Product Image"
          />
          <div class="icon position-absolute" @click="onProductImage = true">
            <EditIcon pathColor="#A6ACB5" />
          </div>
        </div>
      </v-col>
      <v-col md="8">
        <div>
          <v-row class="product-title mb-2 align-center"  justify="space-between" no-gutters>
            <v-col sm="12" md="8">
              <input
                v-model="productName"
                class="product-title-input w-100"
                :placeholder="$t('PRODUCT_ADD_PRODUCT_NAME_CAPTION') + ' *'"
              />
            </v-col>
            <v-col cols="4" sm="12" md="4" lg="3" xl="2" class="d-flex-inline justify-end">
              <v-switch
                v-model="productVisibility"
                class="custom-switcher"
                dense
                hide-details
                inset
                @change="setProductVisibility"
              >
                <template #prepend>
                  <v-label style="color: var(--text)">Rendi visibile</v-label>
                </template>
              </v-switch>
            </v-col>
          </v-row>
          <div class="list-dropdowns included">
            <!--Family Product-->
            <base-select
              v-model="productFamilyValue"
              :options="familyProducts"
              :custom-label="familyProductLabel"
              :label="$t('EDIT_PRODUCT_PRODUCT_FAMILY') + ' *'"
              label-property="name"
              :placeholder="$t('EDIT_PRODUCT_PRODUCT_FAMILY') + ' *'"
              value-property="id"
            />
            <!--End Family Product-->

            <!--Tecnologia-->
            <base-select
              v-model="technology"
              :options="technologies"
              :label="$t('EDIT_PRODUCT_TECHNOLOGY')"
              label-property="name"
              :placeholder="$t('EDIT_PRODUCT_TECHNOLOGY')"
              value-property="id"
            />
            <!--End Family Product-->
          </div>

          <!--Add applications-->
          <div class="add-application">
            <div
              class="d-flex align-center font-weight-medium add-application-btn"
              @click="onProductApplication = true"
            >
              <PlusIcon class="mr-2" path-color="currentColor" />
              {{ $t('PRODUCT_ADD_APPLICATION_MODALITY_TITLE') }} *
            </div>
            <div class="d-flex mt-3 application-chip">
              <Chip
                v-for="item in product?.applicationList || []"
                :key="item.id"
                class="chip rounded-pill"
              >
                <span class="chip-label">{{ item.description }}</span>
              </Chip>
            </div>
          </div>

          <v-dialog
            v-model="onProductApplication"
            max-width="534"
            v-on:click:outside="onProductApplication = false"
          >
            <v-card style="border-radius: 30px">
              <GlobalProductApplicationPopup
                v-on:close="onProductApplication = false"
              />
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>

    <v-dialog
      v-model="onProductImage"
      max-width="534"
      v-on:click:outside="onProductImage = false"
    >
      <v-card style="border-radius: 30px">
        <DocumentPopup
          :product="product"
          v-on:close="onProductImage = false"
          @force-render-image="forceRerender"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss">
.product-detail-container {
  .custom-switcher .v-switch__track {
    color: var(--grey-dark);
  }

  .custom-switcher .v-selection-control--dirty .v-switch__track {
    color: var(--primary);
  }
}
</style>

<style lang="scss" scoped>
.custom-switcher {
  pointer-events: none;
  .v-input--density-default {
    --v-input-padding-top: 10px;
  }
}

.product-detail-container {
  .product-image {
    width: 225px;
    height: 305px;
    object-fit: contain;

    img {
      width: 100%;
    }
  }

  .icon {
    right: 0;
    bottom: 0;
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--white);
    cursor: pointer;
  }

  .product-title-input {
    margin-top: 10px;
    outline: none;
    opacity: 0.7;
    font-size: 30px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--text);
  }

  .list-dropdowns {
    max-width: 250px;
  }

  .add-application {
    margin-top: 100px;

    .add-application-btn {
      height: 48px;
      cursor: pointer;
    }

    .application-chip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .chip {
        font-size: 14px;
        padding: 7px 10px;
        border-radius: 15px;
        box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
        background-color: var(--white);

        .chip-label {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
