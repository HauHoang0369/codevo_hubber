import CropsService from '@/services/Articles/CropsService'

export default {
  namespaced: true,
  state: {
    crops: [],
    selectedCrops: [],
    cropsPage: -1,
    cropsPageTotal: null,
  },
  mutations: {
    setCrops(state, payload) {
      state.crops = [...state.crops, ...payload]
      state.crops.forEach((item) => {
        if (state.selectedCrops.find((v) => v.id === item.id)) {
          item.selected = true
        }
      })
    },

    emptyCrops(state) {
      state.crops = []
      state.cropsPage = -1
      state.cropsPageTotal = null
    },

    setTotalPages(state, payload) {
      state.cropsPageTotal = payload
    },

    selectCrop(state, id) {
      const selected = state.crops.find((item) => item.id === id)
      if (selected.selected) {
        state.selectedCrops = state.selectedCrops.filter(
          (item) => item.id !== selected.id
        )
      } else {
        state.selectedCrops.push(selected)
      }
      state.crops.find((item) => item.id === id).selected = !selected.selected
    },
    removeCrop(state, id) {
      state.selectedCrops = state.selectedCrops.filter((item) => item.id !== id)
      if (state.crops.find((item) => item.id === id)) {
        state.crops.find((item) => item.id === id).selected = false
      }
    },
  },
  actions: {
    callCrops(context, name = undefined) {
      if (context.state.cropsPage !== context.state.cropsPageTotal) {
        context.state.cropsPage++
        return new Promise((resolve, reject) => {
          const legacyToken = context.rootState.user.getOldAccessToken
          const contentLanguage = context.rootState.user.contentLanguage.isoCode
          const marketId = context.rootState.user.market.id
          const page = context.state.cropsPage

          new CropsService()
            .callCrops({
              legacyToken,
              contentLanguage,
              marketId,
              name,
              page,
              hideLoader: true,
            })
            .then((response) => {
              context.commit('setCrops', response.content)
              if (context.state.cropsPage === 0) {
                context.commit('setTotalPages', response.totalPages - 1)
              }
              resolve(response.content)
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
    },
  },
}
