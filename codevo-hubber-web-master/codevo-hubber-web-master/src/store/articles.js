import FriendshipsService from '@/services/Articles/FriendshipsService'
import CropsService from '@/services/Articles/CropsService'
import CategoriesService from '@/services/Categories/CategoriesService'
import MarketService from '@/services/Articles/MarketService'
import LikeService from '@/services/LikeService'

export default {
  namespaced: true,
  state: {
    currentArticle: [],
    commentsArticle: [],
    channels: [],
    channelId: null,
    popupClose: '',
    selectedChannelEdit: null,
  },
  getters: {
    getPopupClose(state) {
      return state.popupClose
    },
    getCurrentArticle(state) {
      return state.currentArticle
    },
    getCommentsArticle(state) {
      return state.commentsArticle
    },
    getSelectedChannelEdit(state) {
      return state.selectedChannelEdit
    },
  },
  mutations: {
    changePopupClose(state, payload) {
      state.popupClose = payload
    },
    setChannels(state, payload) {
      state.channels = payload
    },
    setChannelId(state, payload) {
      state.channelId = payload
    },
    setCurrentArticle(state, payload) {
      state.currentArticle = payload
    },
    setCommentsArticle(state, payload) {
      state.commentsArticle = payload
    },
    setSelectedChannelEdit(state, payload) {
      state.selectedChannelEdit = payload
    },
  },
  actions: {
    async getChannels(context, categoryCode) {
      try {
        const categoryService = new CategoriesService()
        const { content } = await categoryService.getChannels(categoryCode)
        const channels = content ?? []
        context.commit('setChannels', channels)
        if (
          !channels.some((channel) => channel.id === context.state.channelId)
        ) {
          console.log('channels[0]?.id ?? null', channels[0]?.id ?? null)
          context.commit('setChannelId', channels[0]?.id ?? null)
        }
      } catch(error) {
        console.log(error)
      }
    },

    getArticles(context, { page = 0, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .getArticles(context.state.channelId, page, hideLoader)
          .then((response) => {
            resolve(response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    callArticle(context, articleId) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .callArticle(articleId, context.rootState.user.getOldAccessToken)
          .then((response) => {
            context.commit('setCurrentArticle', response)
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    deleteArticle(context, articleId) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .deleteArticle(articleId, context.rootState.user.getOldAccessToken)
          .then((res) => {
            if (res) resolve(true)
            resolve(false)
          })
          .catch(() => {
            reject(false)
          })
      })
    },

    callArticleComments(context, articleId) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .callArticleComments(articleId)
          .then((response) => {
            context.commit('setCommentsArticle', response)
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    addComment(context, data) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .addComment(
            data.id,
            data.comment,
            context.rootState.user.getOldAccessToken
          )
          .then((response) => {
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    createArticle(context, data) {
      return new Promise((resolve, reject) => {
        if (context.state.channelId) {
          data.append('channels', context.state.channelId)
        }
        new CategoriesService()
          .createArticle(data)
          .then((response) => {
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    updateArticle(context, data) {
      return new Promise((resolve, reject) => {
        new CategoriesService()
          .editArticle(data)
          .then((response) => {
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    editArticle(context, data) {
      return new Promise((resolve, reject) => {
        data.append('channels', context.state.channelId)
        new CategoriesService()
          .editArticle(data)
          .then((response) => {
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getFriendships(context, channelId) {
      return new Promise((resolve, reject) => {
        new FriendshipsService()
          .callFriendships(channelId, context.rootState.user.getOldAccessToken)
          .then((response) => {
            resolve(response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getMarkets(context) {
      return new Promise((resolve, reject) => {
        new MarketService()
          .getMarkets(context.rootState.user.getOldAccessToken)
          .then(resolve)
          .catch(reject)
      })
    },

    callCrops(context, payload = undefined) {
      return new Promise((resolve, reject) => {
        new CropsService()
          .callCrops(
            context.rootState.user.getOldAccessToken,
            context.rootState.user.market.id,
            context.rootState.user.contentLanguage.id,
            payload
          )
          .then((response) => {
            resolve(response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    like(context, { id }) {
      return new LikeService().like(id)
    },
  },
}
