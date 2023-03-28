import ProductsService from '@/services/Product/ProductRestV1Service'

export default {
  namespaced: true,
  state: {
    products: [],
    productsPage: -1,
    productsPageTotal: null,
    chosenProducts: [],
    selectedProducts: [],
    currentProduct: null,
    contentLanguageProduct: null,
    systemLanguageProduct: null,
  },
  getters: {
    getSearchedProducts: (state) => state.products,
    getChosenProducts: (state) => state.chosenProducts,
  },
  mutations: {
    setContentLanguageProduct(state, payload) {
      state.contentLanguageProduct = payload
    },
    setSystemLanguageProduct(state, payload) {
      state.systemLanguageProduct = payload
    },
    updateContentLanguageProduct(state, payload) {
      state.contentLanguageProduct = {
        ...state.contentLanguageProduct,
        ...payload,
      }
    },
    updateSystemLanguageProduct(state, payload) {
      state.systemLanguageProduct = {
        ...state.systemLanguageProduct,
        ...payload,
      }
    },
    setCurrentProduct(state, payload) {
      state.currentProduct = payload
    },
    updateCurrentProduct(state, payload) {
      state.currentProduct = {
        ...state.currentProduct,
        ...payload,
      }
    },
    setProducts(state, payload) {
      state.products = [...state.products, ...payload]
      state.products.forEach((item) => {
        if (state.selectedProducts.find((v) => v.id === item.id)) {
          item.selected = true
        }
      })
    },

    emptyProducts(state) {
      state.products = []
      state.productsPage = -1
      state.productsPageTotal = null
    },

    selectProduct(state, id) {
      const selected = state.products.find((item) => item.id === id)
      if (selected.selected) {
        state.selectedProducts = state.selectedProducts.filter(
          (item) => item.id !== selected.id
        )
      } else {
        state.selectedProducts.push(selected)
      }
      state.products.find((item) => item.id === id).selected =
        !selected.selected
    },

    removeProduct(state, id) {
      state.selectedProducts = state.selectedProducts.filter(
        (item) => item.id !== id
      )
      if (state.products.find((item) => item.id === id)) {
        state.products.find((item) => item.id === id).selected = false
      }
    },

    setTotalPages(state, payload) {
      state.productsPageTotal = payload
    },

    setChosenProducts(state) {
      state.chosenProducts = [...state.selectedProducts]
    },

    unSelect(state) {
      state.products.forEach((item) => {
        if (
          item.selected &&
          !state.chosenProducts.find((v) => v.id === item.id)
        ) {
          state.products.find((v) => v.id === item.id).selected = false
        }
      })
      state.selectedProducts = [...state.chosenProducts]
    },

    setProductsChosen(state) {
      state.chosenProducts.forEach((chosen) => {
        if (state.products.find((v) => v.id === chosen.id)) {
          state.products.find((v) => v.id === chosen.id).selected = true
        }
      })
    },
  },
  actions: {
    deleteProduct(context, id) {
      return new Promise((resolve, reject) => {
        new ProductsService()
          .deleteProduct(id)
          .then((res) => {
            if (res) resolve(true)
            resolve(false)
          })
          .catch((res) => {
            reject(res)
          })
      })
    },

    callSearchedProducts(context, name) {
      if (context.state.productsPage !== context.state.productsPageTotal) {
        context.state.productsPage++
        return new Promise((resolve, reject) => {
          const legacyToken = context.rootState.user.getOldAccessToken
          const contentLanguage = context.rootState.user.contentLanguage.isoCode
          const marketId = context.rootState.user.market.id
          const page = context.state.productsPage

          new ProductsService()
            .callSearchedProducts(
              legacyToken,
              contentLanguage,
              marketId,
              name,
              page,
              true
            )
            .then((response) => {
              context.commit('setProducts', response.content)
              if (context.state.productsPage === 0) {
                context.commit('setTotalPages', response.totalPages - 1)
              }
              resolve(response)
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
    },

    updateLanguageProducts(context, payload) {
      context.commit('updateContentLanguageProduct', payload)
      context.commit('updateSystemLanguageProduct', payload)
    },

    setLanguageProducts(context, payload) {
      context.commit('setContentLanguageProduct', payload)
      context.commit('setSystemLanguageProduct', payload)
    },
  },
}
