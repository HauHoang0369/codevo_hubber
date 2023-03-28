<script setup>
import Editor from 'ckeditor5-custom-build'
import { useRouter } from 'vue-router'
import { unref } from 'vue'

import { useArticle } from '@/views/Categories/composables/use-article'

import ArticleChip from '@/components/NewArticle/ArticleChip'
import VisibilityPopup from '@/components/Article/VisibilityPopup'
import DocumentPopup from '@/components/Article/DocumentPopup'
import PictureIcon from '@/components/base/icons/PictureIcon'
import TitleCard from '@/components/Article/TitleCard'
import MarketIcon from '@/components/base/icons/MarketIcon'
import DocumentCard from '@/components/Article/DocumentCard'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import DropdownActions from '@/components/NewArticle/DropdownActions.vue'

const emit = defineEmits(['send-data'])

const router = useRouter()

const {
  visibilities,
  files,
  article,
  date,
  author,
  title,
  text,
  file,
  imageSrc,
  visibilitiesPopupOpen,
  visibility,
  showDocumentPopup,
  attachments,
  chosenCrops,
  getPopupClose,
  getChosenProducts,
  getChosenSolutions,
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
} = useArticle()

const goArticlePage = () => {
  router.push('/categories/ARTICLE')
}

const sendData = () => {
  const { id } = unref(article)
  const fd = getFormData()

  if (id) {
    fd.append('id', id)
  }

  emit('send-data', fd)
}
</script>

<template>
  <div class="new-article-size">
    <form @submit.prevent="sendData">
      <div class="new-article-public-txt-btn">
        <base-icon
          name="public"
          width="16"
          height="16"
          @click="setVisibilityPopup(true)"
        >
          {{ visibility.title }}
        </base-icon>
      </div>
      <div class="icon-system-dropdown">
        <DropdownActions />
      </div>

      <TitleCard
        :article="article"
        :title="title"
        :date="date"
        :author="author"
        @set-date="setDate"
        @set-title="setTitle"
        @set-author="setAuthor"
      />

      <div
        :class="{
          'new-article-image-upload': true,
          'new-article-image-upload-height': !imageSrc,
        }"
      >
        <img v-if="imageSrc" :src="imageSrc" alt="Article Cover Image" />

        <PictureIcon @click="chooseImage" />
      </div>

      <input
        v-show="false"
        @change="uploadImage"
        ref="file"
        type="file"
        accept="jpeg,png,jpg,gif"
      />

      <div class="new-article-text-field">
        <ckeditor :editor="Editor" v-model="text" />
      </div>

      <div class="new-article-icons mb-8">
        <base-icon
          :color="getChosenProducts.length ? '#A6ACB5' : '#E2E4E7'"
          @click="openPopup('ProductPopup')"
          name="articleProduct"
          class="new-article-icon"
        >
          <p v-if="getChosenProducts.length" class="new-article-icon-badge">
            {{ getChosenProducts.length }}
          </p>
        </base-icon>

        <base-icon
          :color="chosenCrops.length ? '#A6ACB5' : '#E2E4E7'"
          @click="openPopup('CropPopup')"
          name="articleCrop"
          class="new-article-icon"
        >
          <p v-if="chosenCrops.length" class="new-article-icon-badge">
            {{ chosenCrops.length }}
          </p>
        </base-icon>

        <base-icon
          :color="getChosenSolutions.length ? '#A6ACB5' : '#E2E4E7'"
          @click="openPopup('SolutionPopup')"
          name="articleSolution"
          class="new-article-icon"
        >
          <p v-if="getChosenSolutions.length" class="new-article-icon-badge">
            {{ getChosenSolutions.length }}
          </p>
        </base-icon>

        <MarketIcon
          @click="openPopup('MarketPopup')"
          :class="{ 'svg-active': getPopupClose === 'MarketPopup' }"
        />
      </div>

      <div class="new-article-chips">
        <article-chip
          v-for="chip in getChosenProducts"
          :key="chip.id"
          :chip="chip"
          @remove-chip="removeChosenProducts"
        />
      </div>
      <div class="new-article-chips">
        <article-chip
          v-for="chip in getChosenSolutions"
          :key="chip.id"
          :chip="chip"
          @remove-chip="removeChosenSolutions"
        />
      </div>

      <div class="new-article-chips">
        <article-chip
          v-for="chip in chosenCrops"
          :key="chip.id"
          :chip="chip"
          @remove-chip="removeChosenCrops"
        />
      </div>

      <div class="new-article-documents-block">
        <div class="new-article-documents-block-heading">
          <h1 class="new-article-title">Documenti</h1>
          <p class="d-flex new-article-documents-btn pointer">
            <svg
              class="mr-1"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 .667a.933.933 0 0 0-.933.933v7.466H1.6a.933.933 0 1 0 0 1.867h7.467V18.4a.933.933 0 1 0 1.866 0l.001-7.467H18.4a.933.933 0 1 0 0-1.866h-7.466V1.6A.933.933 0 0 0 10 .667z"
                fill="var(--primary)"
                fill-rule="evenodd"
              />
            </svg>
            <span @click="setDocumentModal(true)"> Aggiungi documenti </span>
          </p>
        </div>

        <div class="new-article-documents-block-list">
          <DocumentCard
            v-for="(file, index) in attachments"
            :file="file"
            :index="index"
            :key="file.id"
            @on-remove-file="onDocumentRemove"
          />
        </div>
      </div>

      <div class="new-article-footer">
        <p @click="goArticlePage" class="new-article-discard">Annulla</p>
        <button
          :disabled="title.length === 0"
          type="submit"
          :class="{
            'new-article-btn': true,
            'new-article-btn-disabled': title.length === 0,
          }"
        >
          Salva
        </button>
      </div>
    </form>

    <VisibilityPopup
      :visibilities="visibilities"
      :show="visibilitiesPopupOpen"
      @modal-close="setVisibilityPopup(false)"
      @visibility-change="onVisibilityChange"
      @friend-select="onFriendSelect"
    />

    <DocumentPopup
      :show="showDocumentPopup"
      :products="getChosenProducts"
      :files="files"
      @modal-close="setDocumentModal(false)"
      @documents-added="onDocumentsAdded"
    />
  </div>
</template>

<style lang="scss" scoped>
.icon-system-dropdown {
  text-align: right;
  margin: 32px 2px 60px 0;
  svg {
    cursor: pointer;
    width: 10px;
    height: 26px;
    object-fit: contain;
  }
}
.new-article-public-txt-btn {
  cursor: pointer;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.new-article-public-txt-btn p {
  margin-left: 3px;
  font-size: 14px;
  font-weight: normal;
  color: $color-primary;
}

.new-article-title-field {
  height: 85px;
}

.new-article-size {
  width: 1156px;
  margin: 0 auto 32px auto;
}

.new-article-title {
  font-size: 30px;
  font-weight: normal;
  color: $color-primary;
}

.mb-22 {
  margin-bottom: 22px;
}

.new-article-icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 42px;
  width: 50%;
  margin-right: auto;
  margin-left: auto;

  svg {
    cursor: pointer;
    path:hover {
      fill: $color-grey-dark;
    }
  }

  .new-article-icon {
    position: relative;
  }

  .new-article-icon-badge {
    position: absolute;
    right: -5px;
    top: 0;
    background: var(--primary);
    color: var(--white);
    padding: 0 6px;
    border-radius: 7px;
    font-size: 10px;
    font-weight: bold;
  }
}

.svg-active path {
  fill: $color-primary-dark;
}

.new-article-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.new-article-documents-block {
  margin-top: 69px;
  margin-bottom: 206px;

  p span {
    font-size: 16px;
    font-weight: 500;
    color: $color-primary;
  }

  .new-article-documents-btn {
    display: block;
    align-items: center;

    svg,
    span {
      display: block;
    }
  }

  .new-article-documents-block-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .new-article-documents-block-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 40px;
    row-gap: 20px;
  }
}

.new-article-footer {
  display: flex;
  justify-content: space-between;
  padding: 22px 33px;
  align-items: center;
  width: 100%;
  object-fit: contain;
  border-radius: 30px;
  box-shadow: 0 6px 25px -6px rgba($color-grey-teal, 0.3);
  background-color: $color-white;
}

.new-article-discard {
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: $color-primary;
}

button {
  &.new-article-btn {
    text-align: center;
    width: 166px;
    font-size: 16px;
    font-weight: bold;
    padding: 12px;
    color: $color-white;
    border-radius: 24px;
    box-shadow: 0 18px 40px -6px rgba($color-primary, 0.3);
    background-image: linear-gradient(
      to top,
      $color-primary,
      $color-primary-dark
    );
  }

  &.new-article-btn-disabled {
    background-image: unset;
    background-color: $color-greyish-brown;
    color: $color-white;
  }
}

.pointer {
  cursor: pointer;
}

.new-article-image-upload {
  overflow: hidden;
  position: relative;
  width: 1156px;
  height: 400px;
  margin-top: 32px;
  border-radius: 17px;
  border: solid 1px rgba($color-celeste, 0.8);
  background-color: $color-white;

  svg {
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

<style lang="scss" scoped>
.new-article-text-field {
  margin-top: 32px;

  &::v-deep(.ck-editor__editable) {
    min-height: 500px !important;
    border-radius: 0 0 17px 17px !important;
    border: solid 1px rgba($color-celeste, 0.8) !important;
    border-top: none !important;
  }

  &::v-deep(.ck-toolbar) {
    border-radius: 17px 17px 0 0 !important;
    border: solid 1px rgba($color-celeste, 0.8) !important;
    border-bottom: none !important;
  }
}

textarea {
  margin-top: 37px;
  padding: 20px;
  font-size: 16px;
  outline: none;
  border-radius: 17px;
  background: white;
  border: solid 1px rgba($color-celeste, 0.8);
  width: 100%;
}

textarea::placeholder {
  font-size: 16px;
  font-weight: normal;
  color: $color-grey-dark;
}
</style>
