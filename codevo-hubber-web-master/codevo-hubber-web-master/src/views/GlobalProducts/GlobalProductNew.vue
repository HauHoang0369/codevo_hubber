<script setup>
import GlobalProductHeader from '@/components/Product/GlobalProductHeader'
import GlobalProductLingua from '@/components/Product/GlobalProductLingua'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// services
import ProductService from '@/services/Product/ProductService'
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import ProductLineDropdown from '@/components/Product/Dropdowns/ProductLineDropdown.vue'
import Swal from 'sweetalert2'
import ProductIngredients from '@/components/Product/ProductIngredients.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const user = computed(() => store.getters.getUser)
const currentProduct = computed(() => store.state.products.currentProduct)

const isNew = ref(true)
const productLine = reactive({
  text: '',
  show: false,
  value: null,
})

onMounted(async () => {
  if (typeof route.params.id === 'undefined') {
    store.commit('products/setCurrentProduct', null)
  } else {
    isNew.value = false

    const product = await new ProductService().service.getProduct({
      marketId: user.value.market.id,
      productId: route.params.id,
    })

    if (product?.productObjectives) {
      product.ingredients = product.productObjectives[0]?.ingredients.map(
        (item) => {
          item.selected = true
          return item
        }
      )
    }

    store.commit('products/setCurrentProduct', product)
  }
})

const getFormData = (isPublish) => {
  const fd = new FormData()

  if (currentProduct.value?.id) {
    fd.append('id', currentProduct.value.id)
  }

  fd.append('productType', 'CATALOG')
  fd.append('name', currentProduct.value.name)
  fd.append('productFamily.id', currentProduct.value.productFamily.id)

  if (currentProduct.value?.description) {
    fd.append('description', currentProduct.value.description)
  }

  if (currentProduct.value?.technology) {
    fd.append('technology.id', currentProduct.value.technology.id)
    fd.append('technology.name', currentProduct.value.technology.name)
    fd.append('technology.code', currentProduct.value.technology.code)
  }

  productObjectives.value.forEach((objective, idx) => {
    if (objective.id) {
      fd.append(`productObjectives[${idx}].id`, objective.id)
    }

    fd.append(`productObjectives[${idx}].description`, objective.description)

    if (!objective.ingredients.length) return
    objective.ingredients.forEach((ing, ingIdx) => {
      fd.append(`productObjectives[${idx}].ingredients[${ingIdx}].id`, ing.id)
    })
  })

  currentProduct.value?.applicationList?.forEach((p, idx) => {
    if (p.id) {
      fd.append(`applicationList[${idx}].id`, p.id)
    }
  })

  if (currentProduct.value?.claim) {
    fd.append(`claim`, currentProduct.value?.claim)
  }

  if (currentProduct.value?.highlights) {
    currentProduct.value?.highlights.forEach((h, idx) => {
      fd.append(`highlights[${idx}]`, h)
    })
  }

  if (currentProduct.value?.productImage) {
    if (currentProduct.value.productImage?.isNewUpload) {
      fd.append(`imageFile`, currentProduct.value.productImage?.file)
    } else {
      fd.append(`imageUrl`, currentProduct.value.productImage?.url)
    }
  }

  if (isPublish) {
    fd.append('enabled', true)
  } else {
    fd.append('enabled', currentProduct.value.visibility || false)
  }

  return fd
}
const saveProduct = async (isPublish = false) => {
  const fd = getFormData(isPublish)
  store.commit('setLoading', true)
  try {
    let product = null

    if (!currentProduct.value?.id) {
      product = await new ProductService().addProduct(user.value.market.id, fd)
    } else {
      product = await new ProductService().editProduct(user.value.market.id, fd)
    }
    await router.push({
      name: 'GlobalProduct',
      params: { id: product.data.id },
    })
  } catch (e) {
    console.log(e)
    await Swal.fire({
      icon: 'error',
      titleText: 'Something went wrong!',
      customClass: {
        popup: 'hubber-swal-popup',
      },
    })
  }

  store.commit('setLoading', false)
}

const onClickOutside = () => {
  if (productLine.show) {
    productLine.show = false
  }
}

const include = () => {
  return [document.querySelector('.included')]
}

const onProductLineChange = (item) => {
  productLine.show = false // close dropdown
  productLine.value = item
  productLine.text = item.name
}

// Add ingredients modal
const productObjectives = computed({
  get() {
    return currentProduct.value?.productObjectives || []
  },
  set(value) {
    store.commit('products/updateCurrentProduct', { productObjectives: value })
  },
})

const canSave = computed(() => {
  const { productFamily, name, applicationList } = currentProduct.value || {}
  return (
    productFamily &&
    name &&
    productObjectives.value.length > 0 &&
    applicationList &&
    applicationList.length > 0
  )
})
</script>

<template>
  <div>
    <div class="global-product-header">
      <GlobalProductHeader :product="currentProduct" />
    </div>
    <div class="mt-15">
      <GlobalProductLingua :product="currentProduct" />
    </div>

    <product-ingredients class="mt-10" />

    <!--Product line-->
    <div
      v-click-outside="{
        handler: onClickOutside,
        include,
      }"
      class="hubber-dropdown included mt-15"
    >
      <base-input
        v-model="productLine.text"
        :label="$t('PRODUCT_DETAIL_STESSA_LINEA_TITLE')"
        readonly
        @click="productLine.show = true"
      >
        <template #append-inner>
          <base-icon
            class="base-select__icon"
            height="20"
            name="chevronDown"
            width="20"
            @click="productLine.show = true"
          />
        </template>
      </base-input>
      <ProductLineDropdown
        v-if="productLine.show"
        :selected-items="productLine.value ? [productLine.value] : []"
        class="visibility-options"
        @onSelectItem="onProductLineChange"
      />
    </div>
    <!--End Product line-->

    <div class="w-100 bottom-fixed-bar">
      <div class="d-flex align-center justify-space-between action-bar">
        <router-link class="back" to="/GlobalProducts">{{
          $t('PORTAL_CANCEL_TITLE')
        }}</router-link>
        <div>
          <ButtonPrimaryDesktop
            :class="{
              'disabled prevent-click': !canSave,
            }"
            class="save hubber-btn hubber-btn-orange mr-6"
            @click="saveProduct"
          >
            {{ $t('PORTAL_SAVE_TITLE') }}
          </ButtonPrimaryDesktop>

          <ButtonPrimaryDesktop
            :class="{
              'disabled prevent-click': !canSave,
            }"
            class="hubber-btn save-publish"
            @click="saveProduct(true)"
          >
            {{ $t('PORTAL_SAVE_AND_PUBLISH_TITLE') }}
          </ButtonPrimaryDesktop>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.global-product-header {
  margin-top: 30px;
  padding: 26px 35px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba(90, 152, 139, 0.3);
  background-color: var(--white);
}

.hubber-dropdown {
  max-width: 374px;

  .visibility-options {
    overflow: hidden;
    position: inherit;
    max-height: 220px;
  }
}

.bottom-fixed-bar {
  position: fixed;
  bottom: 30px;
  left: 110px;
}

@media (min-width: 960px) {
  .bottom-fixed-bar {
    left: 150px !important;
  }
  .action-bar {
    margin-right: 290px !important;
  }
}

.action-bar {
  margin-right: 115px;
  padding: 22px 31px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgb(90 152 139 / 30%);
  background-color: var(--white);

  .back {
    font-weight: bold;
    letter-spacing: 0.78px;
    text-decoration: none;
  }

  .save {
    width: 160px;
  }

  .save-publish {
    min-width: 175px;
  }

  .hubber-btn {
    &.hubber-btn-orange {
      background-image: linear-gradient(to top, #f9c86c, var(--orange));
    }
  }
}
</style>
