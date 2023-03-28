import { createStore } from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import tank_mix from '@/store/tank_mix'
import categories from '@/store/categories'
import articles from '@/store/articles'
import products from '@/store/products'
import notifications from '@/store/notifications'
import solutions from '@/store/solutions'
import social_wall from '@/store/social_wall'
import crops from '@/store/crops'
import global_solutions from '@/store/global_solutions'

export default createStore({
  state: {
    user: null,
    userSettings: {
      menuOpened: false,
      test: false,
    },
    loading: false,
  },
  getters: {
    getUser(state) {
      return state.user ?? null
    },
    getAccessToken(state) {
      return state.user.access_token
    },
    isLoggedIn(state) {
      return !!state.user.access_token
    },
    getAuthorizationToken(state) {
      return state.user?.token_type + ' ' + state.user.access_token
    },
    getOldAccessToken(state) {
      return state.user?.oldAccessToken
    },
    userImage(state) {
      return state.user != null ? state.user.imageUrl : ''
    },
    userName(state) {
      return state.user != null ? state.user.shownName : ''
    },
    getUserSettings(state) {
      return state.userSettings
    },
    getLoading(state) {
      return state.loading || false
    },
  },
  mutations: {
    loginUser(state, data) {
      state.user = data

      // save to session
      sessionStorage.setItem('user', JSON.stringify(state.user))
    },
    logout(state) {
      state.user = null

      // remove from session
      sessionStorage.removeItem('user')
    },
    saveUserSettings(state, newSettings) {
      state.userSettings = newSettings
      sessionStorage.setItem(
        'user_settings',
        JSON.stringify(state.userSettings)
      )
    },
    setLoading(state, value) {
      console.log('Setting Loading: ' + value)
      state.loading = value
    },
  },
  actions: {
    login(context) {
      context.commit('login')
    },
    logout(context) {
      context.commit('logout')
    },
  },
  modules: {
    tank_mix,
    categories,
    articles,
    products,
    solutions,
    social_wall,
    crops,
    global_solutions,
    notifications,
  },
  // plugins: [createPersistedState()]
})
