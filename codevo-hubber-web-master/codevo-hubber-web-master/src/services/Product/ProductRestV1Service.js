import config from '@/config/config'
import { AuthSettings } from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import { PageableSettings } from '@/services/common/config'
import QueryParamsInterceptor from '@/services/common/interceptors/QueryParamsInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

let instance = null

class ProductRestV1Service {
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
  async getSolutions({
    marketId,
    contentLanguage,
    pageable,
    crops,
    needs,
    onlyFavourites = false,
    soils,
    phenologicalPhaseIds,
    growerSegmentations,
    cropGroupId,
  }) {
    let config = { ...this.client.defaults }
    config.headers['Hubber-Hide-Loading'] = true
    config.params = {
      market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings),
    }
    if (cropGroupId && cropGroupId > 0) config.params.cropGroupId = cropGroupId
    if (crops) config.params.crops = crops
    if (needs) config.params.needs = needs
    config.params.onlyFavourites = onlyFavourites
    if (soils) config.params.soils = soils
    if (phenologicalPhaseIds)
      config.params.phenologicalPhaseIds = phenologicalPhaseIds
    if (growerSegmentations)
      config.params.growerSegmentations = growerSegmentations

    let response = await this.client.get('productservice/v1/solutions', config)
    return response.data
  }

  async getSolutionData(id) {
    let config = { ...this.client.defaults }
    config.params = {}
    let response = await this.client.get(
      'productservice/v1/solutions/' + id + '/',
      config
    )
    console.log(response)
    return response.data
  }

  async toggleSolutionFavourite(solutionId) {
    let config = { ...this.client.defaults }
    config.params = {}
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.put(
      'productservice/v1/solutions/' + solutionId + '/updatePreference',
      config
    )
    return response.data
  }

  async toggleProductFavourite(productId) {
    let config = { ...this.client.defaults }
    config.params = {}
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.put(
      'productservice/v1/products/' + productId + '/updatePreference',
      {},
      config
    )
    return response.data
  }

  async toggleProductMarketVisibility({
    productId,
    marketId,
    contentLanguage,
  }) {
    let config = { ...this.client.defaults }
    config.params = {
      marketId,
      contentLanguage,
    }
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.put(
      'productservice/v1/products/' + productId + '/visibility',
      {},
      config
    )
    return response.data
  }

  async toggleProductEnabled({ productId, marketId, contentLanguage }) {
    let config = { ...this.client.defaults }
    config.params = {
      marketId,
      contentLanguage,
    }
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.put(
      'productservice/v1/products/' + productId + '/enabled',
      {},
      config
    )
    return response.data
  }

  // TODO: Move content language to an interceptor
  async getCropGroups(contentLanguage) {
    let config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'
    config.params = {
      contentLanguage: contentLanguage,
    }
    config.data = {}
    let response = await this.client.get('productservice/v1/cropGroups', config)
    return response.data
  }

  async getProductFamilies(
    marketId,
    hasProduct,
    activeOnly,
    contentLanguage,
    pageable,
    hideLoader,
    global
  ) {
    let config = { ...this.client.defaults }
    // config.headers['Accept'] = '*/*'
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      hasProduct: hasProduct,
      activeOnly: activeOnly,
      contentLanguage: contentLanguage,
      global: global,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get(
      'productservice/v1/productFamilies',
      config
    )
    return response.data
  }

  async getProductClasses(marketId, contentLanguage, userId, hideLoader) {
    let config = { ...this.client.defaults }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      marketId,
      contentLanguage,
      userId,
    }

    const response = await this.client.get(
      'productservice/v1/products/competitor/class',
      config
    )

    return response?.data || []
  }

  async getProductsList(marketId, contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      marketId,
      contentLanguage,
      ...(pageable || PageableSettings),
    }
    console.log('config', config)
    let response = await this.client.get(
      'productservice/v1/search/product',
      config
    )
    return response.data
  }

  async callSearchedProducts(
    legacyToken,
    contentLanguage,
    marketId,
    name,
    page,
    hideLoader
  ) {
    let config = { ...this.client.defaults }

    config.params = {
      contentLanguage,
      marketId,
      page,
    }

    if (name) {
      config.params.name = name
    }

    config.headers['X-LegacyToken'] = legacyToken
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.client.get(
      'productservice/v1/search/product',
      config
    )
    return response.data
  }

  async searchMarket({ name, marketId, page = 0, hideLoader = true }) {
    let config = { ...this.client.defaults }

    config.params = {
      page,
      marketId,
    }

    if (name) {
      config.params.name = name
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.client.get(
      'productservice/v1/search/market',
      config
    )
    return response.data
  }

  async callSearchedSolutions(
    legacyToken,
    contentLanguage,
    marketId,
    name,
    page,
    hideLoader
  ) {
    let config = { ...this.client.defaults }

    config.params = {
      contentLanguage,
      marketId,
      page,
    }

    if (name) {
      config.params.name = name
    }

    config.headers['X-LegacyToken'] = legacyToken
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.client.get(
      'productservice/v1/search/solution',
      config
    )
    return response.data
  }

  async getCrops(contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get('productservice/v1/crops', config)
    return response.data
  }

  async getSoils(contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get('productservice/v1/soils', config)
    return response.data
  }

  async getCropStages(contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get('productservice/v1/cropStages', config)
    return response.data
  }

  async getKnowledgeLevel(contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get(
      'productservice/v1/knowledgelevel',
      config
    )
    return response.data
  }

  async getGlobalCrops(contentLanguage, cropGroupId, pageable, hideLoader) {
    let config = { ...this.client.defaults }

    config.headers['Accept'] = '*/*'

    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }

    if (cropGroupId !== undefined) {
      Object.assign(config.params, { cropGroupId })
    }

    let response = await this.client.get(
      'productservice/v1/crops/global',
      config
    )
    return response.data
  }

  async getApplicationModalities(contentLanguage, pageable) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    config.data = {}
    let response = await this.client.get(
      'productservice/v1/applicationModalities',
      config
    )
    return response.data
  }

  async getProducts({
    marketId,
    contentLanguage,
    activeOnly,
    sendFamilyOrder,
    markets,
    productFamilies,
    crops,
    applicationModalities,
    onlyNew,
    onlyFavourites,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    if (productFamilies !== undefined) {
      Object.assign(config.params, { productFamilies: productFamilies })
    }
    if (activeOnly !== undefined) {
      Object.assign(config.params, { activeOnly: activeOnly })
    }
    if (sendFamilyOrder !== undefined) {
      Object.assign(config.params, { sendFamilyOrder: true })
    }
    if (markets !== undefined) {
      Object.assign(config.params, { markets: markets })
    }
    if (crops !== undefined) {
      Object.assign(config.params, { crops: crops })
    }
    if (applicationModalities !== undefined) {
      Object.assign(config.params, {
        applicationModalities: applicationModalities,
      })
    }
    if (onlyNew !== undefined) {
      Object.assign(config.params, { onlyNew: onlyNew })
    }
    if (onlyFavourites !== undefined) {
      Object.assign(config.params, { onlyFavourites: onlyFavourites })
    }

    let response = await this.client.get('productservice/v1/products', config)
    return response.data
  }

  async getProduct({ marketId, productId, contentLanguage, hideLoader }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId,
      config
    )
    return response.data
  }

  async getGlobalProducts({
    marketId,
    excludedMarket,
    contentLanguage,
    activeOnly,
    // sendFamilyOrder,
    // markets,
    productFamilies,
    // applicationModalities,
    onlyNew,
    onlyFavourites,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      // market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    if (productFamilies !== undefined) {
      Object.assign(config.params, { productFamilies: productFamilies })
    }
    if (activeOnly !== undefined) {
      Object.assign(config.params, { activeOnly: activeOnly })
    }

    if (excludedMarket !== undefined) {
      Object.assign(config.params, { excludedMarket: excludedMarket })
    }
    // if (sendFamilyOrder !== undefined) {
    //   Object.assign(config.params, { sendFamilyOrder: true })
    // }
    // if (markets !== undefined) {
    //   Object.assign(config.params, { markets: markets })
    // }
    // if (crops !== undefined) {
    //   Object.assign(config.params, { crops: crops })
    // }
    // if (applicationModalities !== undefined) {
    //   Object.assign(config.params, {
    //     applicationModalities: applicationModalities,
    //   })
    // }
    if (onlyNew !== undefined) {
      Object.assign(config.params, { onlyNew: onlyNew })
    }
    if (onlyFavourites !== undefined) {
      Object.assign(config.params, { onlyFavourites: onlyFavourites })
    }

    let response = await this.client.get(
      'productservice/v1/products/global',
      config
    )
    return response.data
  }

  async getCompetitorProducts({
    marketId,
    contentLanguage,
    userId,
    classId,
    classes,
    statuses,
    page,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      marketId,
      contentLanguage,
      userId,
      ...(page || PageableSettings.PageableSettings),
    }

    if (classId) {
      Object.assign(config.params, { classId })
    }

    if (classes) {
      Object.assign(config.params, { classId: classes })
    }

    if (statuses) {
      Object.assign(config.params, { statuses })
    }

    const response = await this.client.get(
      'productservice/v1/products/competitor/class/products',
      config
    )

    return response?.data || []
  }

  async getProductIngredients({
    marketId,
    productId,
    contentLanguage,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/ingredient',
      config
    )
    return response.data
  }

  async getProductDocuments({
    marketId,
    productId,
    contentLanguage,
    systemLanguage,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      productId: productId,
      contentLanguage: contentLanguage,
      systemLanguage: systemLanguage,
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/document',
      config
    )
    return response.data
  }

  async getProductDocumentDownload(marketId, productId, documentId) {
    let config = { ...this.client.defaults }
    config.params = {
      market: marketId,
    }
    config.headers['accept'] = '*/*'
    let response = await this.client.get(
      'productservice/v1/products/' +
        productId +
        '/document/' +
        documentId +
        '/download',
      config
    )
    return response.data
  }

  async getProductSolutions({
    marketId,
    productId,
    contentLanguage,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/solution',
      config
    )
    return response.data
  }

  async getProductSameLineProducts({
    marketId,
    productId,
    contentLanguage,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      market: marketId,
      productId: productId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/sameLineProduct',
      config
    )
    return response.data
  }

  async getAvailableMarkets({ hideLoader }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {}
    let response = await this.client.get(
      '/productservice/v1/markets/generic/light',
      config
    )
    return response.data
  }

  async getProductMixes({
    marketId,
    productId,
    contentLanguage,
    result,
    pageable,
    hideLoader,
  }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      result: result,
      market: marketId,
      contentLanguage: contentLanguage,
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/mix',
      config
    )
    return response.data
  }

  async getProductReviews({
    tagType,
    objectId,
    contentLanguage,
    pageable,
    hideLoader,
  }) {
    // /reviews/type/1/lang?page=0&size=1&sort=string'
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/reviews/' +
        tagType +
        '/' +
        objectId +
        '/' +
        contentLanguage,
      config
    )
    return response.data
  }

  async getProductPosts({ productId, pageable, hideLoader }) {
    let config = { ...this.client.defaults }
    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    config.params = {
      ...(pageable || PageableSettings.PageableSettings),
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/post',
      config
    )
    return response.data
  }

  /**************
   * WIP
   **************/

  async getProductsGenericLight(productTypeCode) {
    let config = { ...this.client.defaults }
    config.params = {
      contentLanguage: contentLanguage,
    }
    let response = await this.client.get(
      'productservice/v1/products/' + productId + '/documents',
      config
    )
    return response.data
  }

  async productToggleFavourite(productId) {
    let config = { ...this.client.defaults }
    config.params = {}
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.put(
      'productservice/v1/products/' + productId + '/updatePreference',
      {},
      config
    )
    return response.data
  }

  async searchCrops(
    marketId,
    contentLanguage,
    page = 0,
    name = '',
    hideLoader = false
  ) {
    let config = { ...this.client.defaults }
    config.params = {
      marketId,
      contentLanguage,
      page,
      size: 10,
    }
    if (name) {
      config.params.name = name
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }
    let response = await this.client.get(
      'productservice/v1/search/crop',
      config
    )
    return response.data
  }

  async deleteProduct(productId) {
    let config = { ...this.client.defaults }
    config.params = {
      productId,
    }
    config.headers['Accept'] = '*/*'
    config.data = {}
    let response = await this.client.delete(
      'productservice/v1/products',
      config
    )
    return response.data
  }

  async getProducers({ contentLanguage, pageable, hideLoader, marketId }) {
    const config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'
    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      contentLanguage,
      marketId,
      ...(pageable || PageableSettings.PageableSettings),
    }

    const response = await this.client.get('productservice/v1/producer', config)
    return response.data
  }

  async getProducer({ producerId, contentLanguage, hideLoader, marketId }) {
    const config = { ...this.client.defaults }

    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      contentLanguage,
      marketId,
    }

    const response = await this.client.get(
      `productservice/v1/producer//${producerId}`,
      config
    )
    return response.data
  }

  async deleteProducer({ producerId, hideLoader }) {
    const config = { ...this.client.defaults }

    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    const response = await this.client.put(
      `productservice/v1/producer//${producerId}/disable`,
      {},
      config
    )
    return response.data
  }

  async updateProducer({
    hideLoader,
    data,
    marketId
  }) {
    const config = {...this.client.defaults};

    config.params = {
      marketId,
    }

    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    const response = await this.client.put(`productservice/v1/producer`, data, config);
    return response.data
  }

  async createProducer({
    hideLoader,
    data,
    marketId
  }) {
    const config = {...this.client.defaults};

    config.params = {
      marketId,
    }

    if (hideLoader === true) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    const response = await this.client.post(`productservice/v1/producer`, data, config);
    return response.data
  }

  async getGenericProducts({
    contentLanguage,
    filter = {},
    page,
    hideLoader = true,
  }) {
    let config = { ...this.client.defaults }
    config.headers['Accept'] = '*/*'

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    config.params = {
      contentLanguage,
      filter,
      page: page || PageableSettings.PageableSettings
    }

    const response = await this.client.get(
      'productservice/v1/products/generic',
      config
    )

    return response?.data || []
  }

  async searchIngredients({ marketId, page = 0, hideLoader = true, name='' }) {
    let config = { ...this.client.defaults }

    config.params = {
      page,
      marketId,
    }
    if (name.length > 0) {
      config.params['name']= name
    }


    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await this.client.get(
      'productservice/v1/search/ingredient',
      config
    )
    return response.data
  }
}

export default ProductRestV1Service
