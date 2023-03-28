import { Service } from '@/services/Service'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'
import QueryParamsInterceptor from '@/services/common/interceptors/QueryParamsInterceptor'

function CategoriesService() {
  const { client, useInterceptor } = new Service()

  client.defaults.baseURL += '/socialservice/v1'

  useInterceptor(AuthInterceptor)
  useInterceptor(LoadingInterceptor)
  useInterceptor(QueryParamsInterceptor)
  useInterceptor(ContentLanguageInterceptor)

  const callCategories = async () => {
    let config = { ...client.defaults }
    config.params = {
      type: 'EXPERT_CLUB',
      page: 0,
    }
    let response = await client.get('/categories', config)
    return response.data
  }

  const getChannels = async (categoryCode) => {
    let config = { ...client.defaults }
    config.params = {
      categoryCode,
      page: 0,
      size: 10,
      sort: 'string',
    }
    let response = await client.get('/channels', config)
    return response.data
  }

  const getArticles = async (channelId, page, hideLoader = false) => {
    let config = { ...client.defaults }
    config.params = {
      channelId,
      page,
      size: 10,
      sort: 'string',
    }

    if (hideLoader) {
      config.headers['Hubber-Hide-Loading'] = true
    }

    let response = await client.get('/expertclub/post', config)
    return response.data
  }

  const callArticle = async (articleId) => {
    let config = { ...client.defaults }

    let response = await client.get(`/expertclub/post/${articleId}`, config)
    return response.data
  }

  const getRelatedArticles = async (articleId) => {
    try {
      const {
        data: { content },
      } = await client.get(`/expertclub/post/${articleId}/relatedpost`, {
        ...client.defaults,
      })

      return content
    } catch (error) {
      console.log('Error in fetching related articles', error)
    }
  }

  const getRelatedProducts = async (articleId, market) => {
    try {
      const config = {
        ...client.defaults,
        params: {
          market,
          page: 0,
          size: 10,
          sort: 'string',
        },
      }
      const {
        data: { content },
      } = await client.get(`/expertclub/post/${articleId}/product`, config)

      return content
    } catch (error) {
      console.log('Error in fetching related products', error)
    }
  }

  const getRelatedSolutions = async (articleId, market) => {
    try {
      const config = {
        ...client.defaults,
        params: {
          market,
          page: 0,
          size: 10,
          sort: 'string',
        },
      }
      const {
        data: { content },
      } = await client.get(`/expertclub/post/${articleId}/solution`, config)

      return content
    } catch (error) {
      console.log('Error in fetching related solutions', error)
    }
  }

  const callArticleComments = async (articleId) => {
    try {
      const { data } = await client.get(`/comments/content/${articleId}`)
      return data
    } catch (error) {
      console.log('Error in fetching article comments', error)
    }
  }

  const addComment = async (id, comment) => {
    let config = { ...client.defaults }
    let payload = {
      id: null,
      user: null,
      text: comment,
      date: null,
      totalLikes: null,
      like: null,
      answers: null,
      referencePostCategoryCode: null,
    }
    let response = await client.post(`/comments/content/${id}`, payload, config)
    return response.data
  }

  const createArticle = async (data) => {
    let config = { ...client.defaults }
    config.headers['X-Tenant'] = 'valagro-preprod'
    let response = await client.post(`/expertclub/post`, data, config)
    return response.data
  }

  const editArticle = async (data) => {
    let config = { ...client.defaults }
    config.headers['X-Tenant'] = 'valagro-preprod'
    let response = await client.put(`/expertclub/post`, data, config)
    return response.data
  }

  const deleteArticle = async (articleId) => {
    let config = { ...client.defaults }

    let response = await client.delete(`/expertclub/post/${articleId}`, config)
    return response.data
  }

  return {
    callCategories,
    getChannels,
    callArticle,
    getArticles,
    getRelatedArticles,
    getRelatedProducts,
    getRelatedSolutions,
    callArticleComments,
    addComment,
    editArticle,
    createArticle,
    deleteArticle,
  }
}

export default CategoriesService
