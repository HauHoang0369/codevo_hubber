import CloudRestV1Service from '@/services/Cloud/CloudRestV1Service'
import CloudTestData from '@/services/Cloud/CloudTestData'
import config from '@/config/config'

let instance = null

class CloudService {
  service

  constructor() {
    if (!instance) {
      instance = this
    }
    if (config.USE_BOGUS_DATA) {
      this.service = new CloudTestData()
    }
    // Different switches can be used to define client
    this.service = new CloudRestV1Service()
    return instance
  }
}

export default CloudService
