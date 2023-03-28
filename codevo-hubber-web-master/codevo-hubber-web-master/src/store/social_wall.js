import SocialWallService from '@/services/SocialWall/SocialWallService'

export default {
  namespaced: true,

  state: {
    posts: [],
    dataPost: {},
    friends: [],
    dataFriend: {},
    listFriendShipRequest: [],
    dataFriendShipRequest: {},
    comments: [],
    commentPostId: null,
    viewProfile: {}
  },

  getters: {
    getDataFriendShipRequest(state) {
      return state.dataFriendShipRequest
    },
    getDataPost(state) {
      return state.dataPost
    },
    getViewProfile(state) {
      return state.viewProfile
    }
  },

  mutations: {
    setViewProfile(state, payload) {
      state.viewProfile = payload
    },
    setPosts(state, payload) {
      if (payload.number === 0) {
        state.posts = payload.content
      } else {
        state.posts = [...state.posts, ...payload.content]
      }
    },

    setPostsList(state, payload) {
      state.posts = payload
    },

    setDataPost(state, payload) {
      state.dataPost = payload
    },

    setFriends(state, payload) {
      if (payload.number === 0) {
        state.friends = payload.content
      } else {
        state.friends = [...state.friends, ...payload.content]
      }
    },

    setFriendsList(state, payload) {
      state.friends = payload
    },

    deleteFriendShipRequest(state, payload) {
      state.listFriendShipRequest = payload
    },

    setDataFriend(state, payload) {
      state.dataFriend = payload
    },

    setListFriendShipRequest(state, payload) {
      if (payload.number === 0) {
        state.listFriendShipRequest = payload.content
      } else {
        state.listFriendShipRequest = [...state.listFriendShipRequest, ...payload.content]
      }
    },

    setDataFriendShipRequest(state, payload) {
      state.dataFriendShipRequest = payload
    },

    setCommentPostId(state, payload) {
      state.commentPostId = payload
    },

    setComments(state, payload) {
      state.comments = payload
    }
  },

  actions: {
    getPosts(context, { page = 0, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .getPosts(page, hideLoader)
          .then((response) => {
            context.commit('setPosts', response)
            delete response.content
            context.commit('setDataPost', response)
            resolve(!!response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getFriends(context, { page = 0, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .getFriends(page, hideLoader)
          .then((response) => {
            context.commit('setFriends', response)
            delete response.content
            context.commit('setDataFriend', response)
            resolve(!!response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getUsers(context, { name = '', page = 0, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .getUsers(name, page, hideLoader)
          .then((response) => {
            context.commit('setFriends', response)
            delete response.content
            context.commit('setDataFriend', response)
            resolve(!!response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getListFriendShipRequest(context, { page = 0, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .getListFriendShipRequest(page, hideLoader)
          .then((response) => {
            context.commit('setListFriendShipRequest', response)
            delete response.content
            context.commit('setDataFriendShipRequest', response)
            resolve(!!response.content)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    deletePost(context, postId) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .deletePost(postId)
          .then((res) => {
            if (res) resolve(true)
            resolve(false)
          })
          .catch(() => {
            reject(false)
          })
      })
    },

    deleteFriendShip(context, { friendId, type }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .deleteFriendShip(friendId)
          .then((response) => {
            if (response) {
              if (type === 'FRIEND') {
                context.commit('setFriendsList', context.state.friends.filter((f) => f.id !== friendId))
              } else {
                context.commit('deleteFriendShipRequest', context.state.listFriendShipRequest.filter((f) => f.id !== friendId))
              }
            }
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    acceptFriendShip(context, friendId) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .acceptFriendShip(friendId)
          .then((response) => {
            if (response) {
              context.commit('setFriendsList', [ ...context.state.friends, response ])
              context.commit('deleteFriendShipRequest', context.state.listFriendShipRequest.filter((f) => f.id !== friendId))
            }
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    getComments(context, { postId, hideLoader = false }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .getComments(postId, hideLoader)
          .then((response) => {
            context.commit('setComments', response)
            resolve(!!response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    addComment(context, { params, hideLoader }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .addComment(params, hideLoader)
          .then((response) => {
            // context.commit('setComments', response)
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    addPost(context, { fd, hideLoader }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .addPost(fd, hideLoader)
          .then((response) => {
            // context.commit('setPost', response)
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    editPost(context, { fd, hideLoader }) {
      return new Promise((resolve, reject) => {
        new SocialWallService()
          .editPost(fd, hideLoader)
          .then((response) => {
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },

  modules: {}
}
