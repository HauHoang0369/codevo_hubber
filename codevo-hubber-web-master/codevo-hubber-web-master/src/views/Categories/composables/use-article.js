import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { authImage } from '@/utils/util'

const visibilities = [
  {
    id: 0,
    title: 'Pubblico',
    desc: 'Chiunque può vedere il post',
    icon: '/icons/visibility-globe.svg',
    system: 'PUBLIC',
  },
  {
    id: 1,
    title: 'Amici',
    desc: 'Seleziona gli amici che possono vedere il post',
    icon: '/icons/visibility-people.svg',
    system: 'FRIENDS',
  },
  {
    id: 2,
    title: 'Gruppo',
    desc: 'Seleziona i gruppi che possono vedere il post',
    icon: '/icons/visibility-3people.svg',
    system: 'SELECTEDUSERS',
  },
  {
    id: 3,
    title: 'Mercati',
    desc: 'Seleziona i mercati di riferimento',
    icon: '/icons/visibility-flag.svg',
    system: 'MARKETS',
  },
]

const files = [
  {
    id: 0,
    name: 'Samplefile',
    path: '/path/samplefile.docx',
    imgSrc: '/icons/docs-file.svg',
  },
  {
    id: 1,
    name: 'Samplefile1',
    path: '/path/samplefile1.docx',
    imgSrc: '/icons/docs-file.svg',
  },
  {
    id: 2,
    name: 'Samplefile2',
    path: '/path/samplefile2.docx',
    imgSrc: '/icons/docs-file.svg',
  },
  {
    id: 3,
    name: 'Samplefile3',
    path: '/path/samplefile3.docx',
    imgSrc: '/icons/docs-file.svg',
  },
  {
    id: 4,
    name: 'Samplefile4',
    path: '/path/samplefile4.docx',
    imgSrc: '/icons/docs-file.svg',
  },
]

export const useArticle = () => {
  const store = useStore()
  const route = useRoute()

  const article = ref({})
  const title = ref('')
  const text = ref('')
  const file = ref()
  const attachments = ref([])
  const coverImage = ref(null)
  const friends = ref([])
  const cropPopupOpen = ref(false)
  const visibilitiesPopupOpen = ref(false)
  const visibility = ref(visibilities[0])
  const showDocumentPopup = ref(false)
  const crops = ref([])
  const { value: currentUser } = computed(() => store.getters.getUser)
  const author = ref(currentUser.shownName)

  onMounted(async () => {
    const { channel } = route.query

    if (channel) {
      store.commit('articles/setChannelId', channel)
    }

    if (!route.params.id) {
      return
    }

    const data = await store.dispatch(
      'articles/callArticle',
      Number(route.params.id)
    )

    article.value = data

    if (data.coverImage) {
      coverImage.value = await authImage({
        name: data.coverImage.name,
        path: data.coverImage.url,
      })
    }

    title.value = data.title || ''
    text.value = data.text || ''
    date.value = new Date(data.date)
    author.value = data.user.shownName || currentUser.shownName
  })

  const getChosenProducts = computed(
    () => store.getters['products/getChosenProducts']
  )

  const chosenCrops = computed(() => store.state.crops.selectedCrops)

  const getChosenSolutions = computed(
    () => store.getters['solutions/getChosenSolutions']
  )

  const getPopupClose = computed(() => store.getters['articles/getPopupClose'])

  const removeChosenProducts = ({ id }) => {
    store.commit('products/removeProduct', id)
    store.commit('products/setChosenProducts')
  }

  const removeChosenSolutions = ({ id }) => {
    store.commit('solutions/removeSolution', id)
    store.commit('solutions/setChosenSolutions')
  }

  const setVisibilityPopup = (show) => {
    visibilitiesPopupOpen.value = show
  }

  const setDocumentModal = (show) => {
    showDocumentPopup.value = show
  }

  const onVisibilityChange = (value) => {
    visibility.value = value
  }

  const onFriendSelect = (value) => {
    friends.value = value
  }

  const chooseImage = () => {
    file.value.click()
  }

  const uploadImage = (e) => {
    const uploadedFile = e.target?.files[0]

    if (!uploadedFile) return

    coverImage.value = uploadedFile
  }

  const imageSrc = computed(() => {
    if (!coverImage.value) {
      return ''
    }

    return window.URL.createObjectURL(new Blob([coverImage.value]))
  })

  const openPopup = async (payload) => {
    if (payload === 'ProductPopup') {
      store.commit('products/setProductsChosen')
    }

    store.commit('articles/changePopupClose', payload)
  }

  const onDocumentsAdded = (files) => {
    attachments.value = [...attachments.value, ...files]
  }

  const onDocumentRemove = (index) => {
    const fileAttachments = attachments.value
    fileAttachments.splice(index, 1)

    attachments.value = fileAttachments
  }

  const removeChosenCrops = (item) => {
    store.commit('crops/removeCrop', item.id)
  }

  const getFormData = () => {
    const fd = new FormData()

    fd.append('title', title.value)

    if (text.value.length) {
      fd.append('text', text.value)
    }

    fd.append('visibility', visibility.value.system)

    if (visibility.value.system === 'FRIENDS') {
      fd.append('friends', friends.value)
    }

    if (coverImage.value) {
      fd.append('coverImageFile', coverImage.value)
    }

    if (date.value) {
      fd.append('date', date.value)
    }

    // TODO: Uncomment to get user object when API is ready
    // if (author.value) {
    //   const userObj = {
    //     ...cloneDeep(article.value.user || currentUser),
    //     shownName: author.value
    //   }
    //
    //   fd.append(
    //     'user',
    //     JSON.stringify(userObj)
    //   )
    // }

    return fd
  }

  const date = ref(null)
  const setDate = (value) => (date.value = value)

  const setTitle = (value) => (title.value = value)

  const setAuthor = (value) => (author.value = value)

  return {
    // Constant
    visibilities,
    files,

    // Ref
    article,
    title,
    text,
    date,
    author,
    file,
    coverImage,
    imageSrc,
    friends,
    cropPopupOpen,
    visibilitiesPopupOpen,
    visibility,
    showDocumentPopup,
    attachments,
    crops,

    // computed
    getPopupClose,
    getChosenProducts,
    getChosenSolutions,
    chosenCrops,

    // function
    removeChosenProducts,
    removeChosenSolutions,
    setVisibilityPopup,
    setDocumentModal,
    onVisibilityChange,
    onFriendSelect,
    chooseImage,
    uploadImage,
    openPopup,
    onDocumentsAdded,
    onDocumentRemove,
    removeChosenCrops,
    getFormData,
    setDate,
    setTitle,
    setAuthor,
  }
}
