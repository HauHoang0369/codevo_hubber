<script setup>
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// services
import ProductService from '@/services/Product/ProductService'
import Swal from 'sweetalert2'
import ProductHeader from '@/components/Product/Local/ProductHeader.vue'
import ProductLingua from '@/components/Product/Local/ProductLingua.vue'
import { useProduct } from '@/views/Categories/composables/use-product'
import BaseSelect from '@/components/base/inputs/BaseSelect.vue'
import ProductDocument from '@/components/Product/Local/ProductDocument.vue'
import ProductRelated from '@/components/Product/Local/ProductRelated.vue'
import ProductIngredients from '@/components/Product/ProductIngredients.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

const { currentProduct, systemLanguageProduct } = useProduct()

const user = computed(() => store.getters.getUser)
const isNew = ref(true)
const productLine = reactive({
  text: '',
  show: false,
  value: null,
})
const productLines = ref([])
onMounted(async () => {
  productLines.value = await new ProductService().getProductLines(0, true)
})

onMounted(async () => {
  if (route.params?.id) {
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

    store.commit(
      'products/setCurrentProduct',
      product.length ? product[0] : product
    )
  }
})

const appendProductData = ({ isPublish, fd, index, product }) => {
  fd.append(`products[${index}].name`, product.value.name)
  fd.append(
    `products[${index}].productFamily.id`,
    product.value.productFamily.id
  )
  if (product.value?.technology) {
    fd.append(`products[${index}].technology.id`, product.value.technology.id)
  }

  product.value?.productObjectives?.forEach((objective, idx) => {
    if (objective.id) {
      fd.append(`products[${index}].productObjectives[${idx}].id`, objective.id)
    }

    fd.append(
      `products[${index}].productObjectives[${idx}].description`,
      objective.description
    )

    if (!objective.ingredients.length) return
    objective.ingredients.forEach((ing, ingIdx) => {
      fd.append(
        `products[${index}].productObjectives[${idx}].ingredients[${ingIdx}].id`,
        ing.id
      )
    })
  })

  product.value?.applicationList?.forEach((p, idx) => {
    fd.append(`products[${index}].applicationList[${idx}].id`, p.id)
  })

  if (product.value?.claim) {
    fd.append(`products[${index}].claim`, product.value.claim)
  }

  if (product.value?.highlights) {
    product.value?.highlights.forEach((h) => {
      fd.append(`products[${index}].highlights[]`, h)
    })
  }

  if (product.value?.productImage) {
    if (product.value.productImage?.isNewUpload) {
      fd.append(
        `products[${index}].imageFile`,
        product.value.productImage?.file
      )
    } else {
      fd.append(`products[${index}].imageUrl`, product.value.productImage?.url)
    }
  }

  if (isPublish) {
    fd.append(`products[${index}].enabled`, true)
  } else {
    fd.append(`products[${index}].enabled`, product.value.visibility || false)
  }

  return fd
}

const getFormData = (isPublish) => {
  const fd = new FormData()

  appendProductData({
    isPublish,
    fd,
    index: 0,
    product: currentProduct,
  })

  if (systemLanguageProduct) {
    appendProductData({
      isPublish,
      fd,
      index: 1,
      product: systemLanguageProduct,
    })
  }

  return fd
}
const saveProduct = async (isPublish = false) => {
  const fd = getFormData(isPublish)
  store.commit('setLoading', true)
  try {
    let product = null

    if (currentProduct.value.id) {
      product = await new ProductService().editLocalProduct(
        user.value.market.id,
        currentProduct.value.id,
        fd
      )
    } else {
      product = await new ProductService().addLocalProduct(
        user.value.market.id,
        currentProduct.value.id,
        fd
      )
    }

    await router.push({ name: 'Product', params: { id: product.data.id } })
  } catch (e) {
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

// INIT PRODUCT
onMounted(async () => {
  if (!currentProduct.value?.id) return
  try {
    const res = await new ProductService().initProduct(
      currentProduct.value?.id,
      user.value.market.id,
      user.value.contentLanguage.isoCode,
      true
    )

    if (!res || !res.length) return

    const [contentLanguageProduct, systemLanguageProduct] = res
    store.commit('products/setCurrentProduct', contentLanguageProduct)
    store.commit('products/setContentLanguageProduct', contentLanguageProduct)
    if (systemLanguageProduct) {
      store.commit('products/setSystemLanguageProduct', systemLanguageProduct)
    }
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div>
    <div class="global-product-header">
      <ProductHeader />
    </div>
    <div class="mt-15">
      <ProductLingua />
    </div>

    <product-ingredients class="mt-10" />

    <div class="mt-10">
      <ProductDocument :product="currentProduct" />
    </div>

    <!--Product line-->
    <div class="hubber-dropdown included mt-15">
      <base-select
        v-model="productLine.text"
        :options="productLines"
        label-property="name"
        value-property="id"
        placeholder="Aggiungi una linea"
      />
    </div>
    <!--End Product line-->

    <ProductRelated />

    <div class="d-flex align-center justify-space-between action-bar">
      <router-link class="back" to="/products"> Annulla</router-link>
      <div>
        <ButtonPrimaryDesktop
          :class="{
            'disabled prevent-click':
              !currentProduct?.name ||
              !currentProduct?.productFamily ||
              !currentProduct?.applicationList,
          }"
          class="save hubber-btn hubber-btn-orange mr-6"
          @click="saveProduct"
        >
          Salva
        </ButtonPrimaryDesktop>

        <ButtonPrimaryDesktop
          :class="{
            'disabled prevent-click':
              !currentProduct?.name ||
              !currentProduct?.productFamily ||
              !currentProduct?.applicationList,
          }"
          class="hubber-btn save-publish"
          @click="saveProduct(true)"
        >
          Salva e pubblica
        </ButtonPrimaryDesktop>
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
    max-height: 220px;
  }
}

.action-bar {
  margin-top: 120px;
  padding: 22px 31px;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px var(--grey-teal-30);
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
    width: 175px;
  }

  .hubber-btn {
    &.hubber-btn-orange {
      background-image: linear-gradient(to top, #f9c86c, var(--orange));
    }
  }
}
</style>
