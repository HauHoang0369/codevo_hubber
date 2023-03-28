import CategoriesService from '@/services/Categories/CategoriesService'
export default {
  namespaced: true,
  state: {
    categories: [],
    prevCategoryCode: ''
  },
  getters: {
    getCategories(state) {
      return state.categories ?? []
    },
  },
  mutations: {
    setCategories(state, payload) {
      state.categories = payload
    },
    setPrevCategoryCode(state, payload) {
      state.prevCategoryCode = payload
    },
  },
  actions: {
    callCategories(context) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .callCategories()
          .then((response) => {
            context.commit('setCategories', response.content)
            resolve(!!response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
  modules: {},
}
