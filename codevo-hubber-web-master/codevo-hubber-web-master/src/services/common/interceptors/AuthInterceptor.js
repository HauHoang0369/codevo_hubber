import store from '@/store'

class AuthInterceptor {
  static request(config) {
    // Do something before request is sent
    const user = store.getters.getUser
    const accessToken = user.token_type + ' ' + user.access_token
    const oldAccessToken = user.oldAccessToken

    config.headers['Authorization'] = accessToken
    config.headers['X-LegacyToken'] = oldAccessToken
    return config
  }

  static requestError(error) {
    // Do something with request error
    return Promise.reject(error)
  }

  static response(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  }

  static responseError(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
}

export default AuthInterceptor
