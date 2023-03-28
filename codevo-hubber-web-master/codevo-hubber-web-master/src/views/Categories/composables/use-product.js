import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductService from '@/services/Product/ProductService'

export const useProductHeader = () => {
  const store = useStore()
  const route = useRoute()

  const productImage = computed(
    () => store.state.products.currentProduct?.productImage
  )

  const familyProducts = ref([])
  const technologies = ref([])
  const onProductImage = ref(false)
  const onProductApplication = ref(false)
  const productApplications = computed(
    () => store.state.products.currentProduct?.applicationList || []
  )

  onMounted(async () => {
    store.commit('setLoading', true)
    familyProducts.value = await new ProductService().getFamilyProducts(0, true)
    technologies.value = await new ProductService().getTechnologies(0, true)
    store.commit('setLoading', false)
  })

  // PRODUCT NAME
  const productName = computed({
    get() {
      return store.state.products.currentProduct?.name
    },
    set(value) {
      store.commit('products/updateCurrentProduct', { name: value })
    },
  })

  // PRODUCT VISIBILITY - (false: new product)
  const productVisibility = ref(
    route.params?.id ? store.state.products.currentProduct?.enabled : false
  )
  const setProductVisibility = () => {
    store.commit('products/updateCurrentProduct', {
      visibility: productVisibility.value,
    })
  }

  // TECHNOLOGY
  const technology = computed({
    get() {
      return store.state.products.currentProduct?.technology?.id ?? ''
    },
    set(value) {
      store.commit('products/updateCurrentProduct', {
        technology: technologies.value.find((t) => t.id === value),
      })
    },
  })

  const certificate = computed({
    get() {
      return store.state.products.currentProduct?.certificate ?? ''
    },
    set(value) {
      store.commit('products/updateCurrentProduct', {
        certificate: value,
      })
    },
  })

  // PRODUCT FAMILY
  const familyProduct = computed({
    get() {
      return store.state.products.currentProduct?.productFamily?.id
    },
    set(value) {
      store.commit('products/updateCurrentProduct', {
        productFamily: familyProducts.value.find((p) => p.id === value),
      })
    },
  })

  // NEW PRODUCT
  const newProduct = computed({
    get() {
      return store.state.products.currentProduct?.newProduct ?? false
    },
    set(value) {
      store.commit('products/updateCurrentProduct', {
        newProduct: value,
      })
    },
  })

  return {
    productImage,
    productName,
    familyProducts,
    familyProduct,
    technologies,
    technology,
    onProductImage,
    onProductApplication,
    productVisibility,
    productApplications,
    newProduct,
    certificate,
    setProductVisibility,
  }
}

export const useProduct = () => {
  const store = useStore()
  const currentProduct = computed(() => store.state.products.currentProduct)
  const systemLanguageProduct = computed(
    () => store.state.products.systemLanguageProduct
  )

  const ingredients = computed({
    get() {
      return currentProduct.value?.ingredients || []
    },
    set(value) {
      store.commit('products/updateCurrentProduct', { ingredients: value })
    },
  })

  const ingredientDescription = computed({
    get() {
      return currentProduct.value?.description || []
    },
    set(value) {
      store.commit('products/updateCurrentProduct', { description: value })
    },
  })

  // Reset product states
  onUnmounted(() => {
    store.commit('products/setCurrentProduct', null)
    store.commit('products/setContentLanguageProduct', null)
    store.commit('products/setSystemLanguageProduct', null)
  })

  return {
    currentProduct,
    systemLanguageProduct,
    ingredients,
    ingredientDescription,
  }
}
