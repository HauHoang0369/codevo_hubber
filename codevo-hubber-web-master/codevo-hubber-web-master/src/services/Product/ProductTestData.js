class ProductTestData {
  constructor() {}

  // overrides base service method
  async getSolutions(
    accessToken,
    XLegacyToken,
    XTenant,
    marketId,
    contentLanguage,
    pageable
  ) {
    super.getSolutions(
      accessToken,
      XLegacyToken,
      XTenant,
      marketId,
      contentLanguage,
      pageable
    )
    return {
      data: 'test data',
    }
  }
}

export default ProductTestData
