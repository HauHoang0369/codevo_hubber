<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'

import { authImage } from '@/utils/util'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
import StarIcon from '../base/icons/StarIcon.vue'
// components
import {
  CropIcon,
  MarketIcon,
  PictureIcon,
  ProductIcon,
  SolutionIcon,
} from '@/components/base/icons'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import VisibilityPopup from '@/components/SocialWall/VisibilityPopup'
import {
  CropsDropdown,
  MarketsDropdown,
  ProductsDropdown,
  SolutionsDropdown,
} from '@/components/SocialWall/Dropdowns'
import { useSocialwall } from './composables/use-socialwall'
import AuthImage from '@/components/base/AuthImage/AuthImage.vue'
import CustomTextArea from '@/components/base/inputs/CustomTextArea.vue'
import SocialWallService from '@/services/SocialWall/SocialWallService'
import { cloneDeep } from 'lodash'

const props = defineProps({
  post: Object,
})
const post = ref(cloneDeep(props.post))

const emit = defineEmits(['close'])
const store = useStore()

const { filterTags, visibilities } = useSocialwall()

const user = computed(() => store.getters.getUser)

const isEdit = ref(!!props.post?.id)
const showVisibilityPopup = ref(false)
const behavior = ref(null)
const file = ref()
const tags = ref(props.post?.tags || [])
const tmpTags = ref(props.post?.tags || [])

const isLoading = ref(false)
onMounted(async () => {
  if (!isEdit.value) return

  isLoading.value = true
  post.value = await new SocialWallService().getPost(props.post.id)
  isLoading.value = false

  isEdit.value = !!post.value?.id
  tags.value = post.value?.tags || []
  tmpTags.value = post.value?.tags || []
  visibilityOptions.enabledGroups = post.value?.enabledGroups || []
  visibilityOptions.enabledMarkets = post.value?.enabledMarkets || []
  visibilityOptions.enabledUsers = post.value?.enabledUsers || []
  formData.highlighted = post.value?.highlighted ?? false
  formData.text = post.value?.text || ''
  formData.visibility = isEdit.value
    ? visibilities.find((v) => v.system === post.value?.visibility)
    : visibilities[0]
  formData.coverImage = post.value?.coverImage || null
  formData.coverImageFile = post.value?.coverImageFile || null
  formData.visibilitySelection = visibilityOptions

  groupTags(tags.value)
  if (post.value?.coverImage) {
    // Existing image
    authImage({
      name: post.value?.coverImage.name,
      path: post.value?.coverImage.url,
    }).then((response) => {
      formData.coverImageFile = response
    })
  }
  if (tags.length) {
    formData.tags = JSON.stringify(tags)
  }
})

const selectedTags = ref({
  products: [],
  crops: [],
  solutions: [],
  markets: [],
})

const visibilityOptions = reactive({
  enabledGroups: props.post?.enabledGroups || [],
  enabledMarkets: props.post?.enabledMarkets || [],
  enabledUsers: props.post?.enabledUsers || [],
})

const formData = reactive({
  highlighted: props.post?.highlighted || false,
  text: props.post?.text || '',
  visibility: isEdit.value
    ? visibilities.find((v) => v.system === props.post?.visibility)
    : visibilities[0],
  coverImage: props.post?.coverImage || null,
  coverImageFile: props.post?.coverImageFile || null,
})

const imageSrc = computed(() => {
  if (formData.coverImageFile) {
    // New image uploading
    return window.URL.createObjectURL(new Blob([formData.coverImageFile]))
  }
  return null
})

const getFormData = () => {
  const fd = new FormData()
  fd.append('highlighted', formData.highlighted)
  fd.append('text', formData.text)
  fd.append('visibility', formData.visibility.system)

  if (['GROUPS'].includes(formData.visibility.system)) {
    formData.visibilitySelection.enabledGroups.forEach((id) => {
      fd.append('enabledGroups[]', id)
    })
  }

  if (formData.visibility.system === 'SELECTEDUSERS') {
    formData.visibilitySelection.enabledUsers.forEach((id) => {
      fd.append('enabledUsers[]', id)
    })
  }

  if (formData.visibility.system === 'MARKETS') {
    formData.visibilitySelection.enabledMarkets.forEach((id) => {
      fd.append('enabledMarkets[]', id)
    })
  }

  if (formData.tags) {
    const tags = JSON.parse(formData.tags)
    tags.forEach((tag, k) => {
      fd.append(`tags[${k}].id`, tag?.id || '')
      fd.append(`tags[${k}].category`, tag?.category || '')
      fd.append(`tags[${k}].name`, tag?.name ?? '')
      fd.append(`tags[${k}].correlationId`, tag?.correlationId || '')
    })
  }

  if (formData.coverImageFile) {
    fd.append('coverImageFile', formData.coverImageFile)
  }

  if (isEdit.value) {
    // Edit post
    fd.append('id', props.post.id)
  }
  return fd
}

const addPost = async () => {
  const fd = getFormData()
  store.commit('setLoading', true)
  try {
    if (isEdit.value) {
      // EDIT a post
      const newPostData = await store.dispatch('social_wall/editPost', { fd })
      if (!newPostData.highlighted) {
        // Refresh list posts if changed the post to un-highlighted
        await store.dispatch('social_wall/getPosts', { page: 0 })
      } else {
        const index = store.state.social_wall.posts.findIndex(
          (p) => p.id === props.post?.id
        )
        if (index !== -1) {
          // Found the post in list posts
          store.state.social_wall.posts[index] = newPostData
        }
      }
    } else {
      // ADD a new post
      await store.dispatch('social_wall/addPost', { fd })
      await store.dispatch('social_wall/getPosts', { page: 0 })
    }
    onClose()
  } catch (e) {
    console.error(e)
    await Swal.fire({
      icon: 'error',
      titleText: 'Something went wrong',
      customClass: {
        popup: 'hubber-swal-popup',
      },
    })
  } finally {
    store.commit('setLoading', false)
  }
}

const onClose = () => {
  emit('close')
}

const onVisibilityPopup = (status) => {
  showVisibilityPopup.value = status
}

const visibilityChange = (data, selection) => {
  formData.visibility = data
  formData.visibilitySelection = selection
  showVisibilityPopup.value = false
}

const chooseImage = () => {
  file.value.click()
}

const uploadImage = (e) => {
  const uploadedFile = e.target?.files[0]
  if (uploadedFile) {
    formData.coverImageFile = uploadedFile
  }
}

const groupTags = (tags) => {
  selectedTags.value = {
    products: filterTags(tags, 'PRODUCT'),
    crops: filterTags(tags, 'CROP'),
    solutions: filterTags(tags, 'SOLUTION'),
    markets: filterTags(tags, 'MARKET'),
  }
}

const updateTag = (tag, remove = true, refresh = false) => {
  if (remove) {
    tmpTags.value = tmpTags.value.filter((t) => t.id !== tag.id)
  } else {
    tmpTags.value = [...tmpTags.value, tag]
  }

  if (refresh) {
    tags.value = tmpTags.value
  }
}

const onConfirm = () => {
  tags.value = tmpTags.value
  behavior.value = null
}

const showBehavior = (b) => {
  if (behavior.value !== b) {
    behavior.value = b
  } else {
    behavior.value = null
  }
}

watch(tags, (value) => {
  groupTags(value)
  if (value.length) {
    formData.tags = JSON.stringify(value)
  } else {
    formData.tags = null
  }
})
</script>
<template>
  <form
    class="d-flex align-center justify-center pa-5"
    @submit.prevent="addPost"
  >
    <v-progress-circular v-if="isLoading" indeterminate size="64" />

    <div class="newpost" v-else>
      <v-card-title>
        <div
          class="title-container d-flex flex-row justify-space-between align-start"
        >
          <div class="title mt-5">
            {{ isEdit ? 'Modifica post' : 'Crea un post' }}
          </div>
          <div v-on:click="onClose">
            <img :src="IconClose" class="close-icon" />
          </div>
        </div>
      </v-card-title>
      <v-card-text class="card-form">
        <div class="newpost-content">
          <div class="header d-flex align-center mt-8">
            <div class="post-sender-image">
              <AuthImage :path="user.imageUrl" />
            </div>
            <div class="ml-5 w-100">
              <div class="post-sender-name">{{ user.shownName }}</div>
              <div class="d-sm-flex justify-space-between mt-3 post-status">
                <div
                  class="d-flex align-center visibility"
                  @click="onVisibilityPopup(true)"
                >
                  <img
                    :src="require(`@/assets${formData.visibility.icon}`)"
                    class="small-icon"
                  />
                  <div class="ml-1">{{ formData.visibility.title }}</div>
                </div>
                <div
                  class="d-flex align-center mt-sm-1 post-highlight"
                  @click="formData.highlighted = !formData.highlighted"
                >
                  <StarIcon :starred="formData.highlighted" />
                  <div class="ml-1">Post in evidenza</div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-auto textarea-block">
            <custom-text-area
              v-model="formData.text"
              class="w-100"
              label="Cosa vuoi condividere?"
            />
          </div>
          <div
            class="d-flex w-100 align-center justify-space-between behaviors"
          >
            <div class="behavior-item" @click="showBehavior('picture')">
              <PictureIcon
                :path-color="behavior === 'picture' ? '#00604b' : '#a6acb5'"
              />
            </div>
            <div class="behavior-item" @click="showBehavior('product')">
              <div class="d-flex">
                <ProductIcon
                  class="product-icon"
                  :path-color="behavior === 'product' ? '#00604b' : '#a6acb5'"
                />
                <span
                  v-if="selectedTags.products?.length"
                  class="badge d-flex align-center"
                >
                  {{ selectedTags.products?.length }}
                </span>
              </div>
            </div>
            <div class="behavior-item" @click="showBehavior('crop')">
              <div class="d-flex">
                <CropIcon
                  :path-color="behavior === 'crop' ? '#00604b' : '#a6acb5'"
                />
                <span
                  v-if="selectedTags.crops?.length"
                  class="badge d-flex align-center"
                >
                  {{ selectedTags.crops?.length }}
                </span>
              </div>
            </div>
            <div class="behavior-item" @click="showBehavior('solution')">
              <div class="d-flex">
                <SolutionIcon
                  :path-color="behavior === 'solution' ? '#00604b' : '#a6acb5'"
                />
                <span
                  v-if="selectedTags.solutions?.length"
                  class="badge d-flex align-center"
                >
                  {{ selectedTags.solutions?.length }}
                </span>
              </div>
            </div>
            <div class="behavior-item" @click="showBehavior('market')">
              <div class="d-flex">
                <MarketIcon
                  :path-color="behavior === 'market' ? '#00604b' : '#a6acb5'"
                />
                <span
                  v-if="selectedTags.markets?.length"
                  class="badge d-flex align-center"
                >
                  {{ selectedTags.markets?.length }}
                </span>
              </div>
            </div>
          </div>
          <!--Cover Image-->
          <div v-if="behavior === 'picture'" class="image-upload">
            <div class="h-100 w-100" @click="chooseImage">
              <img
                v-if="imageSrc"
                :src="imageSrc"
                alt="Post Cover Image"
                class="h-100 w-100"
              />
            </div>
            <input
              v-show="false"
              ref="file"
              accept="jpeg,png,jpg,gif"
              type="file"
              @change="uploadImage"
            />
          </div>
          <div v-if="behavior === 'product'" class="behavior-selection">
            <ProductsDropdown
              :selectedItems="selectedTags.products"
              @updateTag="updateTag"
            />
          </div>
          <!--Crop-->
          <div v-if="behavior === 'crop'" class="behavior-selection">
            <CropsDropdown
              :selectedItems="selectedTags.crops"
              @updateTag="updateTag"
            />
          </div>
          <!--Solution-->
          <div v-if="behavior === 'solution'" class="behavior-selection">
            <SolutionsDropdown
              :selectedItems="selectedTags.solutions"
              @updateTag="updateTag"
            />
          </div>
          <!--Market-->
          <div v-if="behavior === 'market'" class="behavior-selection">
            <MarketsDropdown
              :selectedItems="selectedTags.markets"
              @updateTag="updateTag"
            />
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <button
          @click.prevent="onConfirm"
          v-if="['product', 'crop', 'solution', 'market'].includes(behavior)"
          class="modal-confirm"
        >
          {{ $t('PORTAL_CONFIRM_TITLE') }}
        </button>
        <div v-else>
          <div v-if="tags" class="list-tag">
            <v-chip
              v-for="item in tags"
              :key="item.id"
              close-icon="tag-close"
              class="tag-chip"
              closable
              size="small"
              @click:close="updateTag(item, true, true)"
            >
              <span class="mr-2">{{ item.name }}</span>
            </v-chip>
          </div>
          <div class="mt-13 mb-5 publish d-flex justify-center">
            <ButtonPrimaryDesktop class="hubber-btn-primary">
              Pubblica
            </ButtonPrimaryDesktop>
          </div>
        </div>
      </v-card-actions>
      <VisibilityPopup
        :selected-visibility="formData.visibility"
        :selected-markets="selectedTags.markets"
        :visibility-options="visibilityOptions"
        :show="showVisibilityPopup"
        @close="onVisibilityPopup(false)"
        @visibility-change="visibilityChange"
      />
    </div>
  </form>
</template>

<style lang="scss">
.tag-close {
  background-image: url('@/assets/icons/icon-system-close@2x.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 15px;
  height: 15px;
}

.hubber-btn-primary {
  box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3) !important;
  background-image: linear-gradient(
    to top,
    var(--primary),
    var(--primary-dark)
  ) !important;

  .button-label {
    letter-spacing: 0.78px;
  }
}
</style>

<style lang="scss" scoped>
.visibility {
  font-size: 14px;
  cursor: pointer;
}

.newpost {
  width: 100%;
  padding: 20px;
  border-radius: 30px;
  background-color: var(--white);

  .v-card-text {
    max-height: 600px;
    overflow: hidden auto;
  }

  .v-card-actions {
    align-items: normal;
  }

  .publish button {
    min-width: 160px;
  }

  .post-status {
    font-size: 14px;

    .post-highlight {
      cursor: pointer;
    }
  }

  .behaviors {
    margin-top: 30px;
    margin-bottom: 20px;

    .behavior-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .badge {
        height: 16px;
        font-size: 10px;
        font-weight: bold;
        color: var(--white);
        padding: 1px 6px;
        border-radius: 7.5px;
        box-shadow: 0 18px 40px -6px rgba(0, 96, 75, 0.3);
        background-image: linear-gradient(
          to top,
          var(--primary),
          var(--primary-dark)
        );
      }
    }
  }

  .image-upload {
    background: var(--alto);
    width: 100%;
    height: 164px;
    border-radius: 17px;
    overflow: hidden;

    img {
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
}

.title-container {
  padding-left: 30px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--text);
}

.close-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  cursor: pointer;
}

.newpost-content {
  padding-left: 30px;
  padding-right: 30px;
}

.post-sender-image {
  width: 74px;
  height: 74px;

  img {
    width: 74px;
    height: 74px;
    border-radius: 17px;
  }
}

.post-sender-name {
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--primary);
}

.textarea-block {
  margin-top: 30px;
  height: 164px;
}

.small-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.post-area {
  height: 164px;
  border-radius: 17px;
  width: 100%;
  padding: 17px 20px;
  box-sizing: border-box;
  border: solid 1px rgba(105, 158, 255, 0.8);
  background-color: var(--white);

  &:focus-visible {
    outline-color: var(--primary-dark);
  }
}

.list-tag {
  margin: 0 30px;

  .tag-chip {
    margin: 5px;
    padding: 15px;
    font-size: 16px;
    background-color: var(--primary-70);

    span {
      color: var(--white);
    }
  }
}

.product-icon {
  width: 30px;
  height: 30px;
}

@media (min-width: 600px) {
  .behavior-selection {
    width: 414px;
    margin: 0 auto;
    padding-top: 40px;
    border-top: solid 1px rgba(165, 165, 165, 0.2);
  }
}
</style>
