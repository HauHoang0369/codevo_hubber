import AppRestV1Service from '@/services/App/AppRestV1Service'
import AppTestData from '@/services/App/AppTestData'
import config from '@/config/config'
import ProductTestData from "@/services/Product/ProductTestData";
import ProductRestV1Service from "@/services/Product/ProductRestV1Service";

let instance = null

class AppService {
  service

  constructor() {
    if (!instance) {
      instance = this
    }
    if (config.USE_BOGUS_DATA) {
      this.service = new AppTestData()
    }
    // Different switches can be used to define client
    this.service = new AppRestV1Service()
    return instance
  }
}

export default AppService
