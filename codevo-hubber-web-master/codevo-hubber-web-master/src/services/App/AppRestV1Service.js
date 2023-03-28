import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import QueryParamsInterceptor from "@/services/common/interceptors/QueryParamsInterceptor";
import ContentLanguageInterceptor from "@/services/common/interceptors/ContentLanguageInterceptor";

let instance = null

class AppRestV1Service {
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
      baseURL: config.API_BASE_PATH + config.API_PATH,
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
  async getAuthImage({
    path,
    cropArea = 'full',
    width,
    height,
    rotation = 0,
    hideLoader = false,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.responseType = 'arraybuffer'
    // config.params = {file: path, width: width, height: height}
    // let response = await this.client.get('multimediaservice/getImage', config)
    // let response = await this.client.get('/imageserver/iiif/2/{pathImage}/{cropArea}/{width,height}/{rotation}/default.jpg', config)
    let response = await this.client.get(
      `/imageserver/iiif/2/${path}/${cropArea}/${width},${height}/${rotation}/default.jpg`,
      config
    )
    return response.data
  }

  async ask({ form, hideLoader }) {
    const formData = new FormData()
    let config = { ...this.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.client.post(`authenticator/v1/ask`, form, config)
    return response.data
  }

  async askAnonymous({ form, hideLoader }) {
    let config = { ...this.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.client.post(`authenticator/v1/ask/anonymous`, form, config)
    return response.data
  }

  async getUserGroups(name = '', page = 0, active = true, hideLoader = false) {
    let _config = { ...this.client.defaults }
    _config.params = {
      active,
      page,
      size: 10
    }

    if (name) {
      _config.params.name = name
    }

    if (hideLoader) {
      _config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.client.get(`authenticator/v1/userGroups`, _config)
    return response.data
  }

}

export default AppRestV1Service
