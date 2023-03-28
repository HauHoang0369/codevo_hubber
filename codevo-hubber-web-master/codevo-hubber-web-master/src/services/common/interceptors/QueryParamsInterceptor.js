import store from '@/store'
import * as qs from 'qs'

class LoadingInterceptor {
  static request(config) {
    // Make request parameters arrays as repeat . eg param1=1&param2=2 instead of using square brackets
    config.paramsSerializer = (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
    return config
  }

  static requestError(error) {
    return Promise.reject(error)
  }

  static response(response) {
    return response
  }

  static responseError(error) {
    return Promise.reject(error)
  }
}

export default LoadingInterceptor
