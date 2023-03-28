import SocialWallRestV1Service from '@/services/SocialWall/SocialWallRestV1Service'
import SocialWallTestData from '@/services/SocialWall/SocialWallTestData'
import config from '@/config/config'

let instance = null

class SocialWallService {
  service

  constructor() {
    if (!instance) {
      instance = this
    }
    if (config.USE_BOGUS_DATA) {
      this.service = new SocialWallTestData()
    }
    // Different switches can be used to define client
    this.service = new SocialWallRestV1Service()
    return instance
  }

  getPosts = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get('v1/social/post', config)
    return response.data
  }

  getPost = async (postId) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.get(
      `v1/social/post/${postId}`,
      config
    )
    return response.data
  }

  deletePost = async (postId) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.delete(
      `v1/social/post/${postId}`,
      config
    )
    return response.data
  }

  getFriends = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get('v1/friendship', config)
    return response.data
  }

  getUsers = async (name = '', page = 0, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      name,
      page,
      size: 10,
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get('v1/users/search', config)
    return response.data
  }

  getListFriendShipRequest = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      'v1/friendship/request',
      config
    )
    return response.data
  }

  deleteFriendShip = async (friendId) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.delete(
      `v1/friendship/${friendId}`,
      config
    )
    return response.data
  }

  requestFriendShip = async (friendId) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.post(
      `v1/friendship/${friendId}`,
      new FormData(),
      config
    )
    return response.data
  }

  acceptFriendShip = async (friendId) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.put(
      `v1/friendship/${friendId}/request?add=true`,
      new FormData(),
      config
    )
    return response.data
  }

  getComments = async (postId, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      `v1/comments/content/${postId}`,
      config
    )
    return response.data
  }

  addComment = async (params, hideLoader) => {
    let config = { ...this.service.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.service.client.post(
      `v1/comments/content/${params.id}`,
      params,
      config
    )
    return response.data
  }

  addPost = async (fd, hideLoader) => {
    let config = { ...this.service.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.service.client.post(`/v1/social/post`, fd, config)
    return response.data
  }

  likePost = async (postId, fd) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.put(
      `/v1/likes/${postId}`,
      fd,
      config
    )
    return response.data
  }

  editPost = async (fd, hideLoader) => {
    let config = { ...this.service.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.put(`/v1/social/post`, fd, config)
    return response.data
  }

  likeComment = async (commentId, fd) => {
    let config = { ...this.service.client.defaults }
    let response = await this.service.client.put(
      `/v1/likes/${commentId}`,
      fd,
      config
    )
    return response.data
  }
}

export default SocialWallService
