<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import CloudService from '@/services/Cloud/CloudService'
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import BaseInput from '@/components/base/inputs/BaseInput'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import CategoryDropdown from '@/components/Cloud/CategoryDropdown.vue'

const props = defineProps({
  parentId: Number,
  showCopyPermissions: Boolean,
})

const store = useStore()
const emit = defineEmits(['close', 'refreshCloudList'])

const isLoading = ref(false)
const tab = ref('newDocument')
const file = ref(null)
const folderName = ref('')
const description = ref('')
const copyPermissions = ref(false)
const category = reactive({
  show: false,
  text: '',
  value: null,
})
const canUpload = computed(
  () =>
    (tab.value == 'newDocument' && file.value) ||
    (tab.value != 'newDocument' && folderName.value)
)
const userName = computed(() => store.getters.userName)

const onCategoryChange = (item) => {
  if (category.value?.id !== item.id) {
    category.show = false
    category.text = `${item.name}`
    category.value = item
  }
}

const onClose = () => {
  emit('close')
}

const addElement = async () => {
  store.commit('setLoading', true)
  if (canUpload.value) {
    try {
      if (tab.value == 'newDocument') {
        await new CloudService().service.createNewDocument(
          getNewDocumentPayload(),
          userName
        )
      } else {
        await new CloudService().service.createNewFolder(
          getNewFolderPayload(),
          copyPermissions.value
        )
      }
      emit('refreshCloudList')
      onClose()
    } catch (e) {
      console.log(e)
      await Swal.fire({
        icon: 'error',
        titleText: 'Something went wrong!',
        customClass: {
          popup: 'hubber-swal-popup',
        },
      })
      onClose()
    }
  }
}

const getNewDocumentPayload = () => {
  const formData = new FormData()

  formData.append('file', file.value)
  formData.append('folderId', props.parentId)
  formData.append('description', description.value)
  formData.append('getParentPermissions', copyPermissions.value)
  // TODO formData.append('documentType', category.value.item.name);
  return formData
}

const getNewFolderPayload = () => {
  return {
    name: folderName.value,
    description: description.value,
    parent: { id: props.parentId },
  }
}

const onNewDocumentMode = (mode) => {
  newDocumentMode.value = mode
}

const switchPermissions = () => {
  copyPermissions.value = !copyPermissions.value
}

const onFileUpload = (e) => {
  file.value = e.target.files[0] ?? null
}
</script>

<template>
  <div class="hubber-dialog-box">
    <v-card-title>
      <div class="dialog-close" v-on:click="onClose">
        <img :src="IconClose" class="close-icon" />
      </div>
      <div class="title-container d-flex flex-row justify-center">
        <div class="title">Aggiungi un documento o una cartella</div>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-center mt-7">
        <div
          class="tab-title mr-5"
          :class="{ active: tab === 'newDocument' }"
          @click="tab = 'newDocument'"
        >
          Carica documento
        </div>
        <div
          class="tab-title"
          :class="{ active: tab === 'newFolder' }"
          @click="tab = 'newFolder'"
        >
          Nuova cartella
        </div>
      </div>
      <div v-if="tab === 'newDocument'" class="tab-item">
        <div class="docs-browse">
          <label for="file">Carica</label>
          <input type="file" id="file" @change="onFileUpload" capture />
          <div class="text-truncate">{{ file?.name || '...' }}</div>
        </div>
        <div class="list-dropdowns">
          <div v-click-outside="() => (category.show = false)">
            <base-input
              v-model="category.text"
              label="Seleziona categoria"
              readonly
              @click="category.show = true"
            >
              <template #append-inner>
                <base-icon
                  class="base-select__icon"
                  height="20"
                  name="chevronDown"
                  width="20"
                  @click="category.show = true"
                />
              </template>
            </base-input>
            <CategoryDropdown
              v-if="category.show"
              :selected-items="category.value ? [category.value] : []"
              class="visibility-options position-relative"
              @onSelectItem="onCategoryChange"
            />
          </div>
        </div>
        <base-input label="Descrizione" v-model="description" />
        <div v-if="props.showCopyPermissions">
          <v-switch
            v-model="copyPermissions"
            class="custom-switcher"
            dense
            hide-details
            inset
            @change="switchPermissions"
          >
            <template #prepend>
              <v-label style="color: var(--text)"
                >Copia permessi dalla cartella contenitore</v-label
              >
            </template>
          </v-switch>
        </div>
      </div>
      <div v-else class="tab-item">
        <input
          v-model="folderName"
          class="folder-name-input pl-4 w-100 pr-10"
          placeholder="Inserisci il nome della nuova cartella"
          type="text"
        />
        <base-input label="Descrizione" v-model="description" />
        <div v-if="props.showCopyPermissions">
          <v-switch
            v-model="copyPermissions"
            class="custom-switcher"
            dense
            hide-details
            inset
            @change="switchPermissions"
          >
            <template #prepend>
              <v-label style="color: var(--text)"
                >Copia permessi dalla cartella contenitore</v-label
              >
            </template>
          </v-switch>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="mb-5 publish d-flex justify-center flex-column">
      <div class="mt-13 mb-5 publish d-flex justify-center">
        <ButtonPrimaryDesktop
          :disabled="isLoading || !canUpload"
          class="hubber-btn-primary"
          @click="addElement"
        >
          {{ $t('PORTAL_CONFIRM_TITLE') }}
        </ButtonPrimaryDesktop>
      </div>
    </v-card-actions>
  </div>
</template>

<style lang="scss">
.tab-item {
  .custom-switcher .v-switch__track {
    color: var(--grey-dark);
  }

  .custom-switcher .v-selection-control--dirty .v-switch__track {
    color: var(--primary);
  }
}
</style>

<style lang="scss" scoped>
.hubber-dialog-box {
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

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
    }
  }

  .dialog-content {
    font-size: 20px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--text);
  }

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

  .folder-name-input {
    height: 55px;
    background-color: var(--background-blue);
    border-radius: 17px;

    &:focus-visible,
    &:focus {
      outline: none;
    }

    &::-webkit-input-placeholder {
      font-style: italic;
      color: var(--grey-dark);
    }

    &:-moz-placeholder {
      font-style: italic;
      color: var(--grey-dark);
    }

    &::-moz-placeholder {
      font-style: italic;
      color: var(--grey-dark);
    }

    &:-ms-input-placeholder {
      font-style: italic;
      color: var(--grey-dark);
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
</style>
