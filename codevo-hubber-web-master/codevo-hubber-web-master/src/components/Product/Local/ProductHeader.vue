<script setup>
import { ref } from 'vue'
// components
import EditIcon from '@/components/base/icons/EditIcon.vue'
import PlusIcon from '@/components/base/icons/PlusIcon.vue'
import Chip from '@/components/base/buttons/Chip.vue'
import DocumentPopup from '@/components/Product/DocumentPopup'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import GlobalProductApplicationPopup from '@/components/Product/GlobalProductApplicationPopup.vue'
import BaseSelect from '@/components/base/inputs/BaseSelect.vue'
import { useProductHeader } from '@/views/Categories/composables/use-product'
import ProductSizes from '@/components/Product/Local/ProductSizes.vue'
import BaseInput from '@/components/base/inputs/BaseInput.vue'

const {
  productImage,
  productName,
  familyProducts,
  technologies,
  familyProduct,
  technology,
  certificate,
  productVisibility,
  onProductImage,
  onProductApplication,
  productApplications,
  newProduct,
  setProductVisibility,
} = useProductHeader()

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
            v-if="productImage?.url"
            :key="componentKey"
            :height="150"
            :path="productImage?.url"
            :width="150"
          />
          <img
            v-else
            :src="
              productImage?.isNewUpload
                ? productImage?.imageFile
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
          <div class="product-title d-flex align-center justify-space-between">
            <div>
              <input
                v-model="productName"
                class="product-title-input"
                placeholder="Actiwave"
              />
            </div>

            <div class="d-flex align-end flex-column">
              <v-switch
                v-model="newProduct"
                class="custom-switcher"
                dense
                hide-details
                inset
              >
                <template #prepend>
                  <v-label style="color: var(--text)">Nuovo prodotto</v-label>
                </template>
              </v-switch>

              <v-switch
                v-model="productVisibility"
                class="custom-switcher"
                dense
                hide-details
                inset
                @change="setProductVisibility"
                disabled
              >
                <template #prepend>
                  <v-label style="color: var(--text)">Rendi visibile</v-label>
                </template>
              </v-switch>
            </div>
          </div>
          <div class="list-dropdowns included">
            <!--Family Product-->
            <base-select
              v-model="familyProduct"
              :options="familyProducts"
              label="Famiglia prodotto"
              label-property="name"
              placeholder="Famiglia prodotto"
              value-property="id"
              :disabled="true"
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

            <base-input
              v-model="certificate"
              :label="$t('EDIT_PRODUCT_CERTIFICATE')"
            />
            <!--End Family Product-->
          </div>

          <!--Add applications-->
          <div class="d-flex product-header-popup-container">
            <div class="add-application">
              <div
                class="d-flex align-center font-weight-medium add-application-btn"
                @click="onProductApplication = true"
              >
                <PlusIcon class="mr-2" path-color="currentColor" />
                Aggiungi applicazioni
              </div>
              <div class="d-flex mt-3 application-chip">
                <Chip
                  v-for="item in productApplications"
                  :key="item.id"
                  class="chip rounded-pill"
                >
                  <span class="chip-label">{{ item.description }}</span>
                </Chip>
              </div>
            </div>

            <div class="product-header-separator"></div>

            <ProductSizes />
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
          :product="{ productImage }"
          @close="onProductImage = false"
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
.custom-switcher.v-input--density-default {
  --v-input-padding-top: 10px;
}

.product-header {
  &-popup-container {
    gap: 30px;
  }

  &-separator {
    width: 1px;
    background: var(--dusty-gray);
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
