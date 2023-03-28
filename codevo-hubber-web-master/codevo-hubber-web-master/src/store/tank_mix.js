export default {
  namespaced: true,
  state: {
    mix: [],
  },
  getters: {
    getMix(state) {
      return state.mix ?? []
    },
  },
  mutations: {
    setMix(state, value) {
      console.log('SetMix')
      state.mix = value
    },
  },
  actions: {},
  modules: {},
}
