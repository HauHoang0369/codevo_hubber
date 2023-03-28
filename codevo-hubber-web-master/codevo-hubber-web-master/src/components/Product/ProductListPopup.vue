<script setup>
import { reactive, ref } from 'vue'
// icons
import IconClose from '@/assets/icons/icon-system-close-gray@2x.png'
// components
import ButtonPrimaryDesktop from '@/components/base/inputs/ButtonPrimaryDesktop'
import ProductListDropdown from '@/components/Product/Dropdowns/ProductListDropdown.vue'
import BaseInput from '@/components/base/inputs/BaseInput.vue'
import BaseIcon from '@/components/base/icons/BaseIcon.vue'
import ProductFamilyDropdown from '@/components/Product/Dropdowns/ProductFamilyDropdown.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const emit = defineEmits(['close'])
const router = useRouter()

const childRef = ref(null)
const productFamily = reactive({
  show: false,
  text: '',
  value: null,
})
const product = ref(null)

const onClose = () => {
  emit('close')
}

const onSelectProduct = (item) => {
  product.value = item[0]
}

const componentKey = ref(0)
const onProductFamilyChange = (item) => {
  if (productFamily.value?.id !== item.id) {
    productFamily.show = false
    productFamily.text = `${item.name} (${item.code})`
    productFamily.value = item
    componentKey.value++
  }
}

const store = useStore()
const confirmData = () => {
  // Go to Add product page
  store.commit('products/setCurrentProduct', product.value)
  onClose()
  router.push({ name: 'New product' })
}
</script>

<template>
  <div class="hubber-dialog-box">
    <v-card-title>
      <div class="dialog-close" v-on:click="onClose">
        <img :src="IconClose" alt="Close" class="close-icon" />
      </div>
      <div class="title-container d-flex flex-row justify-center">
        <div class="title">{{ $t('SELECT_GLOBAL_PRODUCT_TITLE') }}</div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="list-dropdowns">
        <!--Product line-->
        <div v-click-outside="() => (productFamily.show = false)">
          <base-input
            v-model="productFamily.text"
            :label="$t('PRODUCT_CHOOSE_PRODUCT_FAMILY_MODAL_CAPTION')"
            readonly
            @click="productFamily.show = true"
          >
            <template #append-inner>
              <base-icon
                class="base-select__icon"
                height="20"
                name="chevronDown"
                width="20"
                @click="productFamily.show = true"
              />
            </template>
          </base-input>
          <ProductFamilyDropdown
            v-if="productFamily.show"
            :selected-items="productFamily.value ? [productFamily.value] : []"
            class="visibility-options position-relative"
            @onSelectItem="onProductFamilyChange"
          />
        </div>

        <ProductListDropdown
          v-if="productFamily.value"
          :key="componentKey"
          ref="childRef"
          :product-families="productFamily.value?.id || null"
          :selected-items="[]"
          class="visibility-options"
          @updateTag="onSelectProduct"
        />
      </div>
    </v-card-text>

    <v-card-actions class="mb-5 publish d-flex justify-center flex-column">
      <ButtonPrimaryDesktop
        :class="{ 'disabled prevent-click': !product }"
        class="hubber-btn hubber-btn-primary"
        @click="confirmData"
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
  margin: 36px auto 0;
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
