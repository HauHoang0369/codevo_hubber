export default {
  namespaced: true,
  state: {
    chosenCrop: null,
  },

  mutations: {
    setChosenCrop(state, payload) {
      state.chosenCrop = payload
    },
  },
}
