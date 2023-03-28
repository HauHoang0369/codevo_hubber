<script setup>
import { onMounted, reactive, ref } from 'vue'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import ProductImageDropdown from '@/components/Product/Dropdowns/ProductImageDropdown.vue'
import { cloneDeep } from 'lodash'

const emit = defineEmits(['close', 'select'])
const props = defineProps({
  multiSelect: {
    type: Boolean,
    default: false,
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  fromProduct: {
    type: Boolean,
    default: false,
  },
  selectedFiles: {
    type: Array,
    default: () => [],
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

const onClose = () => {
  emit('close')
}

const onDocumentChange = (items) => {
  currentItems.value = items
}

onMounted(() => {
  currentItems.value = cloneDeep(props.selectedFiles)
})

const onFileUpload = (e) => {
  const f = e.target.files[0] ?? null

  if (f && ['jpg', 'png', 'jpeg'].includes(f.name.split('.').pop())) {
    file.value = f
  } else {
    snackbar.show = true
  }
}

const confirmData = () => {
  if (tab.value === 'selectImage') {
    emit('select', currentItems.value)
  } else {
    if (file.value) {
      const data = {
        isNewUpload: true,
        name: file.value.name,
        mimeType: file.value.type,
        imageFile: URL.createObjectURL(file.value),
        file: file.value,
      }

      emit('select', [data])
    }
  }
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

        <base-input
          v-if="!fromProduct"
          solo
          label="Descrizione"
          v-model="description"
        />
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

<style lang="scss">
.docs-tabs {
  display: flex;
  justify-content: space-evenly;
  margin-top: 25px;

  button {
    font-family: Ubuntu, serif;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    border-radius: 9999px;
    padding: 10px 15px;
    color: var(--primary);
    transition: 0.15s all;

    &.active {
      background-color: var(--primary-70);
      color: var(--white);
    }
  }
}

.docs-browse {
  display: flex;
  justify-content: space-between;
  margin-top: 100px;

  label {
    width: 92px;
    height: 48px;
    margin: 4px 11px 32px 0;
    padding: 12px 24px;
    border-radius: 24px;
    color: var(--white);
    cursor: pointer;
    box-shadow: 0 18px 40px -6px rgba(240, 151, 58, 0.2);
    background-image: linear-gradient(to top, #f9c86c, var(--orange));
  }

  div {
    width: 280px;
    height: 55px;
    margin: 0;
    padding: 15px;
    border-radius: 15px;
    overflow: hidden;
    background-color: var(--background-blue);
  }

  input {
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  }
}

.docs-desc {
  width: 374px;
  height: 55px;
  padding: 19px 223px 18px 20px;
  opacity: 0.5;
  border-radius: 17px;
  border: solid 1px rgba(105, 158, 255, 0.5);
  background-color: var(--white);
  margin: 0 0 100px;
}

.docs {
  .docs-search {
    margin-top: 22px;
  }

  .docs-list {
    height: 325px;
    overflow-y: scroll;

    .docs-list-holder {
      display: flex;

      .docs-checkbox {
        display: flex;
        justify-content: end;
        align-items: center;
      }

      .docs-details {
        display: flex;
        align-items: center;
      }

      .docs-details {
        img {
          position: relative;
          top: 10px;
        }

        h3 {
          width: 234px;
          height: 20px;
          margin: 0px;
          font-family: Ubuntu, serif;
          font-size: 18px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: var(--text);
        }

        p {
          width: 234px;
          height: 24px;
          margin: 0px;
          font-family: Ubuntu, serif;
          font-size: 16px;
          font-weight: 300;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          color: var(--text);
        }
      }
    }
  }
}
</style>
