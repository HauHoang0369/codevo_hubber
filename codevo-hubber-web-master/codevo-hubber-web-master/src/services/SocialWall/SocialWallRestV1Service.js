import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import { PageableSettings } from '@/services/common/config'
import QueryParamsInterceptor from '@/services/common/interceptors/QueryParamsInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

let instance = null

class SocialWallRestV1Service {
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
    this.client.interceptors.response.use(
      LoadingInterceptor.response,
      LoadingInterceptor.responseError
    )

    this.client.interceptors.request.use(
      QueryParamsInterceptor.request,
      QueryParamsInterceptor.requestError
    )
    this.client.interceptors.response.use(
      QueryParamsInterceptor.response,
      QueryParamsInterceptor.responseError
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

  // overrides base service method
}

export default SocialWallRestV1Service
