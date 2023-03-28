import ProductsService from '@/services/Product/ProductRestV1Service'

export default {
  namespaced: true,
  state: {
    solutions: [],
    solutionsPage: -1,
    solutionsPageTotal: null,
    chosenSolutions: [],
    selectedSolutions: [],
  },
  getters: {
    getSearchedSolutions: (state) => state.solutions,
    getChosenSolutions: (state) => state.chosenSolutions,
  },
  mutations: {
    setSolutions(state, payload) {
      state.solutions = [...state.solutions, ...payload]
      state.solutions.forEach((item) => {
        if (state.selectedSolutions.find((v) => v.id === item.id)) {
          item.selected = true
        }
      })
    },

    emptySolutions(state) {
      state.solutions = []
      state.solutionsPage = -1
      state.solutionsPageTotal = null
    },

    selectSolution(state, id) {
      const selected = state.solutions.find((item) => item.id === id)
      if (selected.selected) {
        state.selectedSolutions = state.selectedSolutions.filter(
          (item) => item.id !== selected.id
        )
      } else {
        state.selectedSolutions.push(selected)
      }
      state.solutions.find((item) => item.id === id).selected =
        !selected.selected
    },

    removeSolution(state, id) {
      state.selectedSolutions = state.selectedSolutions.filter(
        (item) => item.id !== id
      )
      if (state.solutions.find((item) => item.id === id)) {
        state.solutions.find((item) => item.id === id).selected = false
      }
    },

    setTotalPages(state, payload) {
      state.solutionsPageTotal = payload
    },

    setChosenSolutions(state) {
      state.chosenSolutions = [...state.selectedSolutions]
    },

    unSelect(state) {
      state.solutions.forEach((item) => {
        if (
          item.selected &&
          !state.chosenSolutions.find((v) => v.id === item.id)
        ) {
          state.solutions.find((v) => v.id === item.id).selected = false
        }
      })
      state.selectedSolutions = [...state.chosenSolutions]
    },

    setSolutionsChosen(state) {
      state.chosenSolutions.forEach((chosen) => {
        if (state.solutions.find((v) => v.id === chosen.id)) {
          state.solutions.find((v) => v.id === chosen.id).selected = true
        }
      })
    },
  },
  actions: {
    callSearchedSolutions(context, name) {
      if (context.state.solutionsPage !== context.state.solutionsPageTotal) {
        context.state.solutionsPage++
        return new Promise((resolve, reject) => {
          const legacyToken = context.rootState.user.getOldAccessToken
          const contentLanguage = context.rootState.user.contentLanguage.isoCode
          const marketId = context.rootState.user.market.id
          const page = context.state.solutionsPage

          new ProductsService()
            .callSearchedSolutions(
              legacyToken,
              contentLanguage,
              marketId,
              name,
              page,
              true
            )
            .then((response) => {
              context.commit('setSolutions', response.content)
              if (context.state.solutionsPage === 0) {
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
  },
}
