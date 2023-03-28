import config from '@/config/config'
import {AuthSettings} from '@/services/AuthService'
import axios from 'axios'
import AuthInterceptor from '@/services/common/interceptors/AuthInterceptor'
import LoadingInterceptor from '@/services/common/interceptors/LoadingInterceptor'
import {PageableSettings} from '@/services/common/config'
import QueryParamsInterceptor from '@/services/common/interceptors/QueryParamsInterceptor'
import ContentLanguageInterceptor from '@/services/common/interceptors/ContentLanguageInterceptor'

        let instance = null

class CloudRestV1Service {
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
    async getCloudRoot() {
        let config = {...this.client.defaults}
        let response = await this.client.get('cloudservice/v1/folders/root', config)
        return response.data
    }

    async getCloudFolder(id) {
        let config = {...this.client.defaults}

        config.params = {
            id: id,
            includeFiles: true,
            includeSubFolders: true,
            firstLevel: true
        }
        let response = await this.client.get('cloudservice/v1/folders', config)
        return response.data
    }

    async createNewFolder(payload, parentPermission) {
        let config = {...this.client.defaults}
        
        config.params = {
            parentPermission: parentPermission
        }

        let response = await this.client.post(
                `cloudservice/v1/folders`,
                payload,
                config
                )
        return response
    }

    async modifyFolder(payload) {
        let config = {...this.client.defaults}
        
        let response = await this.client.put(
                `cloudservice/v1/folders`,
                payload,
                config
                )
        return response
    }

    async deleteFolder(id) {
        let config = {...this.client.defaults}
        
        let response = await this.client.put(
                `cloudservice/v1/folders/` + id,
                config
                )
        return response
    }
        
    async createNewDocument(payload, authorization) {
        let config = {...this.client.defaults}
        
        config.headers['Authorization'] = authorization // TODO viene sovrascritto dall'interceptor che aggiunge il token!!!

        let response = await this.client.post(
                `cloudservice/v1/files`,
                payload,
                config
                )
        return response
    }

    async deleteDocument(id) {
        let config = {...this.client.defaults}
        
        let response = await this.client.delete(
                `cloudservice/v1/files/` + id,
                config
                )
        return response
    }
    
    async getMarkets() {
        let config = {...this.client.defaults}
        let response = await this.client.get('socialservice/v1/users/market', config)
        return response.data
    }

    async getDocumentCategories() {
        return {first: true, last: true, content: [{id: 1, name: 'Categoria 1'}, {id: 2, name: 'Categoria 2'}, {id: 3, name: 'Categoria 3'}, {id: 4, name: 'Categoria 4'}, {id: 5, name: 'Categoria 5'}]}
    }

}

export default CloudRestV1Service
