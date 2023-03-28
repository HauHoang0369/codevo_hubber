<script setup>
import { reactive, ref } from 'vue'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
import CheckIcon from '@/assets/icons/icon-system-check@2x-white.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import {
  CropsDropdown,
  MarketsDropdown,
  ProductsDropdown,
  SolutionsDropdown,
} from '@/components/SocialWall/Dropdowns'

// const props = defineProps({
//   post: Object
// })

const emit = defineEmits(['close'])

const isLoading = ref(false)
const showDropdownType = ref(null)
const selection = reactive({
  market: null,
  type: null,
  product: null,
  crop: null,
  solution: null,
})

const selectionText = reactive({
  market: '',
  type: '',
  product: '',
  crop: '',
  solution: '',
})

const types = [
  {
    name: 'Prodotti',
    id: 1,
  },
  {
    name: 'Soluzioni',
    id: 2,
  },
]

const onClose = () => {
  emit('close')
}

const onMarketChange = (market) => {
  showDropdownType.value = null // close dropdown
  if (selection.market?.id !== market.id) {
    // actual change
    selection.market = market
    selection.crop = null
    selection.solution = null
    selectionText.market = market.name
  }
}

const onTypeChange = (type) => {
  showDropdownType.value = null // close dropdown
  if (selection.type?.id !== type.id) {
    // actual change
    selection.type = type
    selection.crop = null
    selection.solution = null
    selectionText.type = type?.name
  }
}

const tickedChecking = (value) => {
  return value.id === selection.type?.id
}

const onProductChange = (product) => {
  showDropdownType.value = null // close dropdown
  selection.product = product
  selectionText.product = product?.name
}

const onCropChange = (crop) => {
  showDropdownType.value = null // close dropdown
  selection.crop = crop
  selectionText.crop = crop?.name
}

const onSolutionChange = (solution) => {
  showDropdownType.value = null // close dropdown
  selection.solution = solution
  selectionText.solution = solution?.name
}

const onClickOutside = () => {
  if (showDropdownType.value) {
    showDropdownType.value = null
  }
}

const include = () => {
  return [document.querySelector('.included')]
}

const confirmPost = () => {
  // TODO
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
        <div class="title">Trasforma il tuo post in una recensione</div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="dialog-content">
        Scegli uno prodotto o una sola soluzione a cui desideri associare la tua
        recensione
      </div>
      <div class="list-dropdowns included">
        <!--Markets-->
        <div
          v-click-outside="{
            handler: onClickOutside,
            include,
          }"
        >
          <base-input
            v-model="selectionText.market"
            label="Mercati"
            readonly
            @click="showDropdownType = 'market'"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="showDropdownType = 'market'"
              />
            </template>
          </base-input>
          <MarketsDropdown
            v-if="showDropdownType === 'market'"
            :selected-items="selection.market ? [selection.market] : []"
            class="visibility-options"
            @onMarketChange="onMarketChange"
          />
        </div>
        <!--End Markets-->

        <!--Types-->
        <div class="position-relative">
          <base-input
            v-model="selectionText.type"
            label="Tipi"
            readonly
            @click="showDropdownType = 'type'"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="showDropdownType = 'type'"
              />
            </template>
          </base-input>
          <div
            v-if="showDropdownType === 'type'"
            class="extend-items flex-grow-1"
          >
            <div
              v-for="item in types"
              :key="item.id"
              class="d-flex flex-row align-center"
              @click.prevent="onTypeChange(item)"
            >
              <div class="d-flex align-center justify-space-between item w-100">
                <div class="item-name">{{ item.name }}</div>
                <div
                  v-if="tickedChecking(item)"
                  class="tick-icon rounded-circle"
                >
                  <img :src="CheckIcon" alt="Check" class="fill-height" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--End Types-->

        <!-- Products -->
        <div v-if="selection.type?.id === 1">
          <base-input
            v-model="selectionText.product"
            label="Prodotti locali"
            readonly
            @click="showDropdownType = 'product'"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="showDropdownType = 'product'"
              />
            </template>
          </base-input>
          <ProductsDropdown
            v-if="showDropdownType === 'product'"
            :selected-items="selection.product ? [selection.product] : []"
            class="visibility-options"
            @updateTag="onProductChange"
          />
        </div>
        <!-- End Products -->
        <div v-if="selection.type?.id === 2">
          <!-- CROP -->
          <base-input
            v-model="selectionText.crop"
            label="Colture"
            readonly
            @click="showDropdownType = 'crop'"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="showDropdownType = 'crop'"
              />
            </template>
          </base-input>
          <CropsDropdown
            v-if="showDropdownType === 'crop'"
            :selected-items="selection.crop ? [selection.crop] : []"
            class="visibility-options"
            @updateTag="onCropChange"
          />
          <!-- SOLUTION -->
          <base-input
            v-model="selectionText.solution"
            label="Soluzioni locali"
            readonly
            @click="showDropdownType = 'solution'"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="showDropdownType = 'solution'"
              />
            </template>
          </base-input>
          <SolutionsDropdown
            v-if="showDropdownType === 'solution'"
            :selected-items="selection.solution ? [selection.solution] : []"
            class="visibility-options"
            @updateTag="onSolutionChange"
          />
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="mb-5 publish d-flex justify-center">
      <ButtonPrimaryDesktop
        :disabled="isLoading"
        class="hubber-btn-primary"
        @click="confirmPost"
      >
        {{ $t('PORTAL_CONFIRM_TITLE') }}
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
}

.list-dropdowns {
  margin: 56px auto;
  max-width: 374px;
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
