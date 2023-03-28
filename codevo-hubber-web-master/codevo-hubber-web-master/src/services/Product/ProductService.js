import ProductRestV1Service from '@/services/Product/ProductRestV1Service'
import ProductTestData from '@/services/Product/ProductTestData'
import config from '@/config/config'
import { PageableSettings } from '@/services/common/config'

let instance = null

class ProductService {
  service

  constructor() {
    if (!instance) {
      instance = this
    }
    if (config.USE_BOGUS_DATA) {
      this.service = new ProductTestData()
    }
    // Different switches can be used to define client
    this.service = new ProductRestV1Service()
    return instance
  }

  getFamilyProducts = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/family/all',
      config
    )
    return response.data
  }

  getTechnologies = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/technology/all',
      config
    )
    return response.data
  }

  getApplications = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/applicationModalities',
      config
    )
    return response.data
  }

  getSizes = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/size/all',
      config
    )
    return response.data
  }

  getProductLines = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/line/all',
      config
    )
    return response.data
  }

  getProductImages = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/images',
      config
    )
    return response.data
  }

  addProduct = async (marketId, fd, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      type: 'CATALOG',
      marketId,
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.post(
      `/productservice/v1/products/global`,
      fd,
      config
    )
    return response
  }

  addLocalProduct = async (
    marketId,
    globalProductId,
    fd,
    hideLoader = false
  ) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      type: 'CATALOG',
      marketId,
      globalProductId,
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.post(
      `/productservice/v1/products/local`,
      fd,
      config
    )
    return response
  }

  editLocalProduct = async (
    marketId,
    globalProductId,
    fd,
    hideLoader = false
  ) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      type: 'CATALOG',
      marketId,
      globalProductId,
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.put(
      `/productservice/v1/products/local`,
      fd,
      config
    )
    return response
  }

  editProduct = async (marketId, fd, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      type: 'CATALOG',
      marketId,
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.put(
      `/productservice/v1/products/global`,
      fd,
      config
    )
    return response
  }

  getProductIngredients = async (page, hideLoader = false) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      page,
      size: 10,
    }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.service.client.get(
      '/productservice/v1/products/ingredient/all',
      config
    )
    return response.data
  }

  initProduct = async (id, market, language, hideLoader = true) => {
    let config = { ...this.service.client.defaults }
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      market,
      contentLanguage: language,
    }

    let response = await this.service.client.get(
      `/productservice/v1/products/${id}/init`,
      config
    )
    return response.data
  }

  searchGlobalProducts = async ({ contentLanguage, name, page }) => {
    let config = { ...this.service.client.defaults }
    config.params = {
      contentLanguage,
      name,
      page,
      size: 10,
    }
    config.headers['Hubber-Hide-Loading'] = true
    let response = await this.service.client.get(
      '/productservice/v1/search/globalProduct',
      config
    )
    return response.data
  }

  searchNeed = async ({ description, page = 0 }) => {
    const pageable = {
      page,
      size: 10,
      sort: 'asc',
    }

    let config = { ...this.service.client.defaults }
    config.params = {
      pageable,
      description,
    }
    config.headers['Hubber-Hide-Loading'] = true

    let response = await this.service.client.get(
      'productservice/v1/needs',
      config
    )
    return response.data
  }

  getGlobalSolutions = async ({
    crop,
    need = null,
    markets = [],
    page = 0,
  }) => {
    const pageable = {
      page,
      size: 9,
      sort: 'asc',
    }

    let config = { ...this.service.client.defaults }
    config.params = {
      pageable,
      crop,
    }

    if (need) config.params.need = need
    if (markets.length) config.params.markets = markets

    config.headers['Hubber-Hide-Loading'] = true

    let response = await this.service.client.get(
      'productservice/v1/solutions/global',
      config
    )
    return response.data
  }
}

export default ProductService
