<script setup>
import { computed, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { clone } from 'lodash'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import Grid from '@/components/base/Grid/Grid'
// icons
import DeleteIcon from '@/components/base/icons/DeleteIcon.vue'
import PlusIcon from '@/components/base/icons/PlusIcon.vue'

const emit = defineEmits(['close'])
const store = useStore()

const contentLanguageProduct = computed(
  () => store.state.products.currentProduct
)
const systemLanguageProduct = computed(
  () => store.state.products.systemLanguageProduct
)

const isLoading = ref(false)

const contentLanguageData = ref({
  claim: contentLanguageProduct.value?.globalProductId
    ? systemLanguageProduct.value?.claim ?? ''
    : contentLanguageProduct.value?.claim ?? '',
  highlights: contentLanguageProduct.value?.globalProductId
    ? systemLanguageProduct.value?.highlights ?? []
    : contentLanguageProduct.value?.highlights ?? [],
})

const systemLanguageData = ref({
  claim: systemLanguageProduct.value?.claim ?? '',
  highlights: systemLanguageProduct.value?.highlights ?? [],
})

const onClose = () => {
  emit('close')
}

const addContent = (systemClaim = false) => {
  if (!systemClaim) {
    const { highlights } = contentLanguageData.value

    if (highlights.length) {
      contentLanguageData.value.highlights = [...highlights, '']
    } else {
      contentLanguageData.value.highlights = ['']
    }
  } else {
    const { highlights } = systemLanguageData.value

    if (highlights.length) {
      systemLanguageData.value.highlights = [...highlights, '']
    } else {
      systemLanguageData.value.highlights = ['']
    }
  }
}

const deleteContent = (index, systemClaim = false) => {
  if (!systemClaim) {
    const tmp = clone(contentLanguageData.value.highlights)
    tmp.splice(index, 1)
    contentLanguageData.value.highlights = tmp
  } else {
    const tmp = clone(systemLanguageData.value.highlights)
    tmp.splice(index, 1)
    systemLanguageData.value.highlights = tmp
  }
}

const confirmData = async () => {
  // Update product highlight
  await store.commit(
    'products/updateCurrentProduct',
    unref(contentLanguageData)
  )
  if (systemLanguageProduct) {
    await store.commit(
      'products/updateSystemLanguageProduct',
      unref(systemLanguageData)
    )
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
    </v-card-title>

    <v-card-text>
      <Grid
        :column-gap="30"
        :lg="systemLanguageProduct ? 2 : 1"
        :row-gap="30"
        :xl="systemLanguageProduct ? 2 : 1"
        md="1"
        sm="1"
      >
        <div>
          <div class="highlight-title">
            {{ $t('MAIN_MENU_LANGUAGE_TITLE') }} 1
          </div>

          <div class="highlight-box my-7 overflow-y-auto overflow-x-hidden">
            <div style="height: 113px">
              <textarea
                v-model="contentLanguageData.claim"
                :placeholder="$t('PRODUCT_ADD_CLAIM_CAPTION')"
                class="highlight-textarea w-100 h-100"
              ></textarea>
            </div>
            <v-row
              v-for="(h, index) in contentLanguageData.highlights"
              :key="index"
              no-gutters
              style="margin-top: 10px"
            >
              <v-col
                class="flex-grow-1 flex-shrink-0"
                cols="1"
                style="min-width: 100px; max-width: 100%"
              >
                <textarea
                  v-model="contentLanguageData.highlights[index]"
                  :placeholder="$t('PRODUCT_ADD_HIGHLIGHT_CAPTION')"
                  class="highlight-textarea w-100"
                  rows="2"
                />
              </v-col>
              <v-col
                class="flex-grow-0 flex-shrink-0 d-flex justify-end align-center"
                cols="1"
              >
                <DeleteIcon
                  class="delete-content"
                  path-color="#A6ACB5"
                  @click="deleteContent(index)"
                />
              </v-col>
            </v-row>
          </div>

          <div
            class="d-inline-flex align-center font-weight-medium pt-2 add-content"
            @click="addContent(false)"
          >
            <PlusIcon class="mr-2" path-color="currentColor" />
            {{ $t('PRODUCT_ADD_HIGHLIGHT_CAPTION') }}
          </div>
        </div>

        <!--NOT a global product-->
        <div v-if="!systemLanguageProduct?.globalProductId">
          <div class="highlight-title">
            {{ $t('MAIN_MENU_LANGUAGE_TITLE') }} 2
          </div>

          <div class="highlight-box my-7 overflow-y-auto overflow-x-hidden">
            <div style="height: 113px">
              <textarea
                v-model="systemLanguageData.claim"
                :placeholder="$t('PRODUCT_ADD_CLAIM_CAPTION')"
                class="highlight-textarea w-100 h-100"
              ></textarea>
            </div>
            <v-row
              v-for="(h, index) in systemLanguageData.highlights"
              :key="index"
              no-gutters
              style="margin-top: 10px"
            >
              <v-col
                class="flex-grow-1 flex-shrink-0"
                cols="1"
                style="min-width: 100px; max-width: 100%"
              >
                <textarea
                  v-model="systemLanguageData.highlights[index]"
                  :placeholder="$t('PRODUCT_ADD_HIGHLIGHT_CAPTION')"
                  class="highlight-textarea w-100"
                  rows="2"
                />
              </v-col>
              <v-col
                class="flex-grow-0 flex-shrink-0 d-flex justify-end align-center"
                cols="1"
              >
                <DeleteIcon
                  class="delete-content"
                  path-color="#A6ACB5"
                  @click="deleteContent(index, true)"
                />
              </v-col>
            </v-row>
          </div>

          <div
            class="d-inline-flex align-center font-weight-medium pt-2 add-content"
            @click="addContent(true)"
          >
            <PlusIcon class="mr-2" path-color="currentColor" />
            {{ $t('PRODUCT_ADD_HIGHLIGHT_CAPTION') }}
          </div>
        </div>
      </Grid>
    </v-card-text>

    <v-card-actions
      class="mb-5 mt-15 publish d-flex justify-center flex-column"
    >
      <ButtonPrimaryDesktop
        :disabled="isLoading"
        class="hubber-btn-primary"
        @click="confirmData"
      >
        {{ $t('PORTAL_SAVE_TITLE') }}
      </ButtonPrimaryDesktop>
    </v-card-actions>
  </div>
</template>

<style lang="scss" scoped>
.hubber-dialog-box {
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 6px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--white);

  .v-card-text {
    overflow: hidden auto;

    .highlight-box {
      max-height: 425px;
      min-height: 120px;
    }

    .highlight-title {
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--text);
    }

    .highlight-textarea {
      border-radius: 17px;
      width: 100%;
      padding: 14px 20px;
      box-sizing: border-box;
      border: solid 1px rgba(105, 158, 255, 0.5);
      background-color: var(--white);
      line-height: normal;
      color: var(--text);

      &:focus-visible {
        outline: none;
        border: 1px solid var(--celeste);
        background-color: rgba(105, 158, 255, 0.1);
      }

      &:placeholder-shown {
        border: solid 1px rgba(105, 158, 255, 0.8);
      }
    }

    .delete-content,
    .add-content {
      cursor: pointer;
    }
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

  .hubber-btn-primary {
    min-width: 183px;
  }
}
</style>
