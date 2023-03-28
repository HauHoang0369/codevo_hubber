export default {
  namespaced: true,
  state: {
    show: false,
    content: '',
    isError: false,
  },
  getters: {
    getState: (state) => state,
  },
  mutations: {
    setSnackBar(state, payload) {
      state.show = payload.show;
      state.content = payload.content;
      state.isError = payload.isError;
    }
  }
}
