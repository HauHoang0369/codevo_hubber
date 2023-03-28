class AppTestData {
  constructor() {}

  // overrides base service method
  async getAuthImage(path) {
    super.getAuthImage(path)
    return {
      // TODO: return standart image base64 data
      data: 'test data',
    }
  }
}

export default AppTestData
