<script setup>
import { onMounted, reactive } from 'vue'
import { DownLoadIcon, ShareIcon } from "@/components/base/icons";
import DocumentCard from '@/components/DocumentList/DocumentCard'
import Grid from '@/components/base/Grid/Grid'
import ProductDetailSection from "@/components/Product/ProductDetailSection.vue";

const props = defineProps({
  documents: Array,
  more: Number,
  showMore: Boolean,
  loading: Boolean,
  error: String,
  divider: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['loadMore', 'download'])

const selectedDocuments = reactive([])

onMounted(async () => {
  // documents.value=
})

const onSelectDocument = async (document) => {
  let selectedDocumentIndex = selectedDocuments.indexOf(document)
  if (selectedDocumentIndex === -1) {
    selectedDocuments.push(document)
  } else {
    selectedDocuments.splice(selectedDocumentIndex, 1)
  }
}

const isSelected = (document) => {
  let selectedDocumentIndex = selectedDocuments.indexOf(document)
  return selectedDocumentIndex !== -1
}

const onLoadMore = () => {
  emit('loadMore')
}
const onDownload = async () => {
  if (selectedDocuments?.length > 0) {
    emit('download', [...selectedDocuments])
  }
}
</script>

<template>
  <div>
    <ProductDetailSection
      load-more-label="Mostra altri1"
      :more="more"
      :show-more="showMore"
      :no-data="documents?.length===0"
      :loading="loading" :fetch-error="error" v-on:load-more="onLoadMore">
      <template v-slot:title>Documenti</template>
      <template v-slot:actions>
        <div class="d-flex align-center">
          <span>Hai selezionato {{ selectedDocuments.length }} documenti</span>

          <button
            class="action-btn ml-4 ml-md-10"
            v-on:click.prevent="onDownload"
            :disabled="selectedDocuments.length === 0"
          >
            <DownLoadIcon class="action-icon" />
          </button>

          <button
            class="action-btn ml-4 ml-md-10"
            :disabled="selectedDocuments.length === 0"
          >
            <ShareIcon class="action-icon" />
          </button>

        </div>
      </template>
      <Grid xl="3" lg="3" md="2" sm="1" :column-gap="40" :row-gap="20"
            class="documents-container">
        <DocumentCard
          v-for="(item, index) in documents" :key="index"
          :item="item"
          :isSelected="isSelected(item)"
          @click="onSelectDocument(item)"
        ></DocumentCard>
      </Grid>
    </ProductDetailSection>
    <v-divider class="mt-15 mb-15" v-if="divider"></v-divider>
  </div>
</template>

<style lang="scss" scoped>
.icon-download {
  cursor: pointer;
}

.icon-share {
  cursor: pointer;
}

.documents-container {
  margin-top: 30px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;

  &:not(:disabled) {
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  &:disabled {
    &::v-deep {
      path {
        color: $color-grey-dark;
      }
    }
  }
}

.action-icon {
  width: 30px;
  height: 30px;
}
</style>
