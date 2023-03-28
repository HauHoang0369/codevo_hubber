import { AuthSettings } from '@/services/AuthService'
import config from '@/config/config'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

let instance = null
class LikeService {
  client

  // Move to common class
  static accessToken
  static xLegacyToken

  constructor() {
    if (!instance) {
      instance = this
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': AuthSettings.XTenant,
      },
      timeout: 60000,
      baseURL: config.API_BASE_PATH + config.API_PATH + '/socialservice/',
    }
    this.client = axios.create(axiosConfig)
    this.client.interceptors.request.use(
      AuthInterceptor.request,
      AuthInterceptor.requestError
    )
    this.client.interceptors.response.use(
      AuthInterceptor.response,
      AuthInterceptor.responseError
    )

    this.client.interceptors.request.use(
      LoadingInterceptor.request,
      LoadingInterceptor.requestError
    )

    this.client.interceptors.request.use(
      ContentLanguageInterceptor.request,
      ContentLanguageInterceptor.requestError
    )
    this.client.interceptors.response.use(
      ContentLanguageInterceptor.response,
      ContentLanguageInterceptor.responseError
    )

    return instance
  }

  like = async (id) => {
    let config = { ...this.client.defaults }
    let response = await this.client.put(`v1/likes/${id}`, config)
    return response.data
  }
}

export default LikeService
