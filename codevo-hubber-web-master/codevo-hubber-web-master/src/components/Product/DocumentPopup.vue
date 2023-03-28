<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { clone } from 'lodash'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import ProductImageDropdown from '@/components/Product/Dropdowns/ProductImageDropdown.vue'

const emit = defineEmits(['close', 'forceRenderImage'])
const store = useStore()
const props = defineProps({
  product: Object,
  multiSelect: {
    type: Boolean,
    default: false,
  },
})

const isLoading = ref(false)
const tab = ref('selectImage')
const currentItems = ref([])
const file = ref(null)
const description = ref('')
const snackbar = reactive({
  show: false,
  text: 'warning: the chosen file is not valid',
})

onMounted(() => {
  if (props.product?.productImage) {
    currentItems.value = clone([props.product.productImage])

    if (currentItems.value[0]?.isNewUpload) {
      tab.value = 'uploadImage'
      file.value = currentItems.value[0]
    }
  }

  description.value = props.product?.description || ''
})

const onClose = () => {
  emit('close')
}

const onDocumentChange = (items) => {
  currentItems.value = items
}

const onFileUpload = (e) => {
  const f = e.target.files[0] ?? null

  if (f && ['jpg', 'png', 'jpeg'].includes(f.name.split('.').pop())) {
    file.value = f
  } else {
    snackbar.show = true
  }
}

const confirmData = () => {
  // Update product image
  const payload = {
    productImage: null,
    imageUrl: null,
    imageFile: null,
  }

  if (tab.value === 'selectImage') {
    if (currentItems.value.length) {
      payload.productImage = currentItems.value[0]
      payload.imageUrl = payload.productImage.url
    }
  } else {
    if (file.value) {
      payload.productImage = {
        isNewUpload: true,
        name: file.value.name,
        mimeType: file.value.type,
        imageFile: URL.createObjectURL(file.value),
        file: file.value,
      }
      payload.imageFile = file.value
      payload.description = description.value
    }
  }
  store.commit('products/updateCurrentProduct', payload)
  emit('forceRenderImage')
  onClose()
}
</script>

<template>
  <div class="hubber-dialog-box">
    <v-card-title>
      <div class="dialog-close" v-on:click="onClose">
        <img :src="IconClose" alt="Close" class="close-icon" />
      </div>
      <div class="title-container d-flex flex-row justify-center">
        <div class="title">Aggiungi un documento</div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="d-flex justify-center mt-7">
        <div
          class="tab-title mr-5"
          :class="{ active: tab === 'selectImage' }"
          @click="tab = 'selectImage'"
        >
          Cerca nella libreria
        </div>
        <div
          class="tab-title"
          :class="{ active: tab === 'uploadImage' }"
          @click="tab = 'uploadImage'"
        >
          Carica nuovo
        </div>
      </div>

      <div v-if="tab === 'selectImage'" class="tab-item">
        <ProductImageDropdown
          :selected-items="currentItems"
          :multi-select="multiSelect"
          class="visibility-options"
          @update-tag="onDocumentChange"
        />
      </div>
      <div v-else class="tab-item">
        <div class="docs-browse">
          <label for="file">Carica</label>
          <input type="file" id="file" @change="onFileUpload" capture />
          <div class="text-truncate">{{ file?.name || '...' }}</div>
        </div>

        <base-input solo label="Descrizione" v-model="description" />
      </div>
    </v-card-text>

    <v-card-actions class="mb-5 publish d-flex justify-center flex-column">
      <ButtonPrimaryDesktop
        :disabled="isLoading"
        class="hubber-btn-primary"
        @click="confirmData"
      >
        {{ $t('PORTAL_CONFIRM_TITLE') }}
      </ButtonPrimaryDesktop>
    </v-card-actions>

    <v-snackbar
      v-model="snackbar.show"
      timeout="3000"
      color="var(--orange)"
      rounded="pill"
      elevation="24"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
.hubber-dialog-box {
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  // Tab
  .tab-title {
    padding: 10px 15px;
    border-radius: 18px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: normal;
    line-height: 1;
    cursor: pointer;

    &.active {
      background-color: var(--primary-70);
      color: var(--white);
    }
  }

  .tab-item {
    max-width: 380px;
    margin: 22px auto;
  }

  .v-card-text {
    max-height: 530px;
    overflow: hidden auto;
  }

  .dialog-close {
    position: absolute;
    right: 20px;

    .close-icon {
      width: 30px;
      height: 30px;
      object-fit: contain;
      cursor: pointer;
    }
  }

  .title-container {
    .title {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-align: center;
      color: var(--primary);
      white-space: normal;
    }
  }

  .hubber-btn-primary {
    min-width: 183px;
  }
}
</style>
