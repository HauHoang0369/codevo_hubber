import TankMixRestV1Service from '@/services/TankMix/TankMixRestV1Service'

let instance = null
class TankMixService {
    service

    constructor() {
      if (!instance) {
        instance = this
      }
      this.service = new TankMixRestV1Service()
      return instance
    }
}

export default TankMixService