<template>
  <div class="product-documents-block">
    <div class="product-documents-block-heading">
      <h1 class="product-documents-title">Documenti</h1>
      <p class="d-flex product-documents-btn pointer">
        <PlusIcon class="mr-2" path-color="currentColor" />
        <span @click="setDocumentModal(true)"> Aggiungi documenti </span>
      </p>
    </div>

    <div class="product-documents-block-list">
      <DocumentCard
        v-for="(file, index) in attachments"
        :file="file"
        :index="index"
        :key="file.id"
        @on-remove-file="onDocumentRemove"
      />
    </div>

    <v-dialog
      v-model="showDocumentPopup"
      max-width="534"
      @click:outside="showDocumentPopup = false"
    >
      <v-card style="border-radius: 30px">
        <DocumentPopup
          multi-select
          is-new-product
          from-product
          :selected-files="attachments"
          @close="setDocumentModal(false)"
          @select="onDocumentsAdded"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import DocumentCard from '@/components/Article/DocumentCard.vue'
import { ref } from 'vue'
import DocumentPopup from '@/components/Document/DocumentPopup.vue'
import PlusIcon from '@/components/base/icons/PlusIcon.vue'

const attachments = ref([])
const showDocumentPopup = ref(false)
const onDocumentRemove = (index) => {
  const fileAttachments = attachments.value
  fileAttachments.splice(index, 1)

  attachments.value = fileAttachments
}
const setDocumentModal = (state) => {
  showDocumentPopup.value = state
}
const onDocumentsAdded = (files) => {
  attachments.value = [...files]
}
</script>

<style lang="scss">
.product-documents-block {
  margin-top: 69px;

  .product-documents-title {
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: var(--primary);
  }

  p span {
    font-size: 16px;
    font-weight: 500;
    color: var(--primary);
  }

  .product-documents-btn {
    display: block;
    align-items: center;
    cursor: pointer;

    svg,
    span {
      display: block;
    }
  }

  .product-documents-block-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .product-documents-block-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 40px;
    row-gap: 20px;
  }
}
</style>
