<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import ProductApplicationDropdown from '@/components/Product/Dropdowns/ProductApplicationDropdown'
import { cloneDeep } from 'lodash'

const emit = defineEmits(['close'])
const store = useStore()

const isLoading = ref(false)
const data = computed(
  () => store.state.products.currentProduct?.applicationList || []
)
const selectedItems = ref(cloneDeep(data.value))
const childRef = ref(null)

const onClose = () => {
  emit('close')
}

const onApplicationsChange = (applications) => {
  selectedItems.value = applications
}

const toggleAllItems = (checkAll = true) => {
  childRef.value.onSelect(null, checkAll)
}

const confirmData = async () => {
  // Update product applications
  await store.commit('products/updateCurrentProduct', {
    applicationList: selectedItems.value,
  })
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
        <div class="title">
          {{ $t('PRODUCT_ADD_APPLICATION_MODALITY_TITLE') }}
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="list-dropdowns included">
        <ProductApplicationDropdown
          ref="childRef"
          :selected-items="data || []"
          class="visibility-options"
          @updateTag="onApplicationsChange"
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
      <div
        v-if="selectedItems.length"
        class="deselect-btn mt-9"
        @click="toggleAllItems(false)"
      >
        {{ $t('TANK_MIX_DESELECT_PRODUCT_CAPTION') }}
      </div>
      <div v-else class="deselect-btn mt-9" @click="toggleAllItems(true)">
        {{ $t('PRODUCT_SELECT_ALL_CAPTION') }}
      </div>
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
    max-height: 600px;
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

  .hubber-btn-primary {
    min-width: 183px;
  }

  .deselect-btn {
    cursor: pointer;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: 0.78px;
    color: var(--primary);
  }
}

.list-dropdowns {
  position: relative;
  margin: 56px auto 0;
  max-width: 380px;
}

.extend-items {
  position: absolute;
  width: 100%;
  z-index: 1;
  margin-top: -20px;
  padding: 18px 0 20px;
  border-radius: 20px;
  box-shadow: 0 6px 11px 2px rgb(0 0 0 / 10%);
  background-color: var(--white);

  .item {
    height: 41px;
    padding: 12px 16px;

    .item-name {
      color: var(--text);
    }

    &:hover {
      background-color: var(--background-blue);
      cursor: pointer;
    }

    .tick-icon {
      height: 23px;
      width: 23px;
      background-image: linear-gradient(to bottom, #009982, var(--primary));
    }
  }
}
</style>
