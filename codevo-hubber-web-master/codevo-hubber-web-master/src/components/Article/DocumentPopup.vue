<template>
  <DynamicPopup v-if="show" @closePopup="closeModal">
    <template #header>
      <span class="modal-title"> Aggiungi un documento </span>
    </template>

    <template #body>
      <div class="docs-tabs" v-if="hasChooseProduct">
        <button @click="setDocsTab(0)" :class="docTab === 0 ? 'active' : ''">
          Cerca nella libreria
        </button>
        <button @click="setDocsTab(1)" :class="docTab === 1 ? 'active' : ''">
          Carica nuovo
        </button>
      </div>
      <div v-if="docTab === 0 && hasChooseProduct">
        <div class="docs">
          <div class="docs-search">
            <base-input
              solo
              label="Cerca un documento"
              append-inner-icon="mdi-magnify"
              v-model="filterText"
            />
          </div>
          <div class="docs-list">
            <div
              v-for="item in filterFiles"
              :key="item.id"
              class="docs-list-holder"
            >
              <div class="docs-details">
                <img :src="item.imgSrc" :alt="item.name" />
                <div class="docs-title">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.path }}</p>
                </div>
              </div>
              <v-checkbox
                class="docs-checkbox"
                :false-icon="'mdi-checkbox-blank-circle-outline'"
                :true-icon="'mdi-check-circle'"
                v-model="libraryDocs"
                :value="item"
              >
              </v-checkbox>
            </div>
          </div>
        </div>
      </div>

      <div v-if="docTab === 1">
        <div class="docs-browse">
          <label for="file">Carica</label>
          <input type="file" id="file" @change="onFileUpload" capture />
          <div>{{ documentName ? documentName : '...' }}</div>
        </div>

        <base-input solo label="Descrizione" v-model="description" />
      </div>
    </template>

    <template #footer>
      <button @click="onSubmit" class="modal-confirm">
        <span>{{ $t('PORTAL_CONFIRM_TITLE') }}</span>
      </button>
    </template>
  </DynamicPopup>
</template>

<script setup>
import { computed, ref } from 'vue'
import { random } from 'lodash'
import DynamicPopup from '@/components/Popup/DynamicPopup'
import BaseInput from '@/components/base/inputs/BaseInput'
import { includesLowStr } from '@/utils/util'

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  products: {
    type: Array,
    default: () => [],
  },
  files: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit', 'modal-close', 'documents-added'])

const filterText = ref('')
const docTab = ref(1)
const document = ref(null)
const description = ref('')
const libraryDocs = ref([])

const filterFiles = computed(() => {
  if (!filterText.value) {
    return props.files
  }

  return props.files.filter((file) =>
    includesLowStr(file.name, filterText.value)
  )
})

const hasChooseProduct = computed(() => {
  return props.products && props.products.length > 0
})

const documentName = computed(() => {
  const fileName = document.value?.name || ''

  return fileName.substring(
    fileName.split('').length - 25,
    fileName.split('').length
  )
})

const closeModal = () => {
  filterText.value = ''
  docTab.value = 1
  document.value = null
  description.value = ''
  libraryDocs.value = []
  emit('modal-close')
}

const setDocsTab = (tab) => {
  document.value = null
  libraryDocs.value = []
  docTab.value = tab
}

const onFileUpload = (e) => {
  document.value = e.target.files[0] ?? null
}

const onSubmit = () => {
  let documents = libraryDocs.value

  if (document.value) {
    // @TODO: change the document to Object or libraryDocs to File later
    documents = [
      ...documents,
      {
        id: random(),
        name: document.value.name,
        description: description.value,
      },
    ]
  }

  emit('documents-added', documents)
  closeModal()
}
</script>

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
