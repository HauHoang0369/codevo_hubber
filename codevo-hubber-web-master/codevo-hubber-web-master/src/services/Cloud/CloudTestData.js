class CloudTestData {
  constructor() {}

  // overrides base service method
  async getCloud(
  ) {
    return {
      content: [{id: 1, name: 'folder1', type: 'folder'}, {id: 2, name: 'folder2', type: 'folder'}, {id: 3, name: 'folder3', type: 'folder'}, {id: 4, name: 'folder4', type: 'folder'}]
    };
  }
}

export default CloudTestData
